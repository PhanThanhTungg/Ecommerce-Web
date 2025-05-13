import pandas as pd
from prophet import Prophet
import pyodbc
import matplotlib.pyplot as plt

# Kết nối tới SQL Server
conn = pyodbc.connect(
  'DRIVER={ODBC Driver 17 for SQL Server};'
  'SERVER=BLAITE\SQLWH;'
  'DATABASE=WHHTTTQL;'
  'UID=sa;'
  'PWD=123456'
)

query = '''
  SELECT s.Time_key , sum(s.revenue) as revenue
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
print(data)

conn.close()
df = pd.DataFrame(data)

model = Prophet()
model.fit(df)

future = model.make_future_dataframe(periods=10)
forecast = model.predict(future)

print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(10))

for row in forecast.tail(20).itertuples():
    print(f"{row.ds.date()} | {row.yhat:.2f}        | {row.yhat_lower:.2f}     | {row.yhat_upper:.2f}")

fig1 = model.plot(forecast)
plt.title("Prophet Forecast Example")
plt.show()

fig2 = model.plot_components(forecast)
plt.show()