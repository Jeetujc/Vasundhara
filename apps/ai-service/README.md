# AI service

FastAPI service for ForestGreen AI risk prediction.

## Endpoint

- `POST /score` with land-acquisition parameters
- Returns:
  - `risk_score`
  - `average_delay_days`
  - `remark`

The model uses a Random Forest ensemble trained from the online California Housing dataset fetched through scikit-learn.
