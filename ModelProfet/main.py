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

    if body.get('day'):
      days = 30
      days = body.get('day')
      future = model.make_future_dataframe(periods=days)
      forecast = model.predict(future)
      result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(days).to_dict(orient='records')
      return jsonify({"status": "success", "predictions": result})
    else:
      now = pd.to_datetime('now', utc=True).tz_convert('Asia/Ho_Chi_Minh')
      next1 = now + pd.DateOffset(months=1)
      next2 = now + pd.DateOffset(months=2)
      next3 = now + pd.DateOffset(months=3)

      future = model.make_future_dataframe(periods=120)
      forecast = model.predict(future)
      result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(120).to_dict(orient='records')

      nextMonth1 = {
        "month": next1.strftime('%Y-%m'),
        "yhat": sum([x['yhat'] for x in result if x['ds'].strftime('%Y-%m') == next1.strftime('%Y-%m')]),
        "yhat_lower": sum([x['yhat_lower'] for x in result if x['ds'].strftime('%Y-%m') == next1.strftime('%Y-%m')]),
        "yhat_upper": sum([x['yhat_upper'] for x in result if x['ds'].strftime('%Y-%m') == next1.strftime('%Y-%m')])
      }
      nextMonth2 = {
        "month": next2.strftime('%Y-%m'),
        "yhat": sum([x['yhat'] for x in result if x['ds'].strftime('%Y-%m') == next2.strftime('%Y-%m')]),
        "yhat_lower": sum([x['yhat_lower'] for x in result if x['ds'].strftime('%Y-%m') == next2.strftime('%Y-%m')]),
        "yhat_upper": sum([x['yhat_upper'] for x in result if x['ds'].strftime('%Y-%m') == next2.strftime('%Y-%m')])
      }
      nextMonth3 = {
        "month": next3.strftime('%Y-%m'),
        "yhat": sum([x['yhat'] for x in result if x['ds'].strftime('%Y-%m') == next3.strftime('%Y-%m')]),
        "yhat_lower": sum([x['yhat_lower'] for x in result if x['ds'].strftime('%Y-%m') == next3.strftime('%Y-%m')]),
        "yhat_upper": sum([x['yhat_upper'] for x in result if x['ds'].strftime('%Y-%m') == next3.strftime('%Y-%m')])
      }

      return jsonify({
        "status": "success",
        "predictions": {
          "nextMonth1": nextMonth1,
          "nextMonth2": nextMonth2,
          "nextMonth3": nextMonth3
        }
      })
      
      
    
  
  except Exception as e:
    return jsonify({"status": "error", "message": str(e)}), 500
if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=5000)
