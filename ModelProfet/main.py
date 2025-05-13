import pandas as pd
from prophet import Prophet
import pyodbc
from joblib import dump, load
from flask import Flask, jsonify, request

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/train_model', methods=['POST'])
def train_model():
  try:
    conn = pyodbc.connect(
      'DRIVER={ODBC Driver 17 for SQL Server};'
      'SERVER=BLAITE\SQLWH;'
      'DATABASE=WHHTTTQL;'
      'UID=sa;'
      'PWD=123456'
    )

    query = '''
      SELECT s.Time_key, sum(s.revenue) as revenue
      FROM Fact_Sale as s
      group by s.Time_Key
      order by s.time_key'''
    df = pd.read_sql(query, conn)

    ds = list(map(lambda x: pd.to_datetime(x, utc=True).tz_convert('Asia/Ho_Chi_Minh').date(), df['Time_key']))
    y = df['revenue'].tolist()
    data = {
      'ds': ds,
      'y': y
    }
    conn.close()
    
    df = pd.DataFrame(data)
    model = Prophet()
    model.fit(df)
    
    dump(model, 'prophet_model.joblib')
    
    return jsonify({"status": "success", "message": "Model trained and saved successfully"})
  
  except Exception as e:
    return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
  try:
    body = request.get_json()
    model = load('prophet_model.joblib')
    
    days = 30
    days = body.get('day')
    future = model.make_future_dataframe(periods=days)
    forecast = model.predict(future)
    
    result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(days).to_dict(orient='records')
    
    return jsonify({"status": "success", "predictions": result})
  
  except Exception as e:
    return jsonify({"status": "error", "message": str(e)}), 500
if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=5000)
