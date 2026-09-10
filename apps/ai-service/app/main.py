from __future__ import annotations

from functools import lru_cache

import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.datasets import fetch_california_housing
from sklearn.ensemble import RandomForestRegressor
from sklearn.exceptions import NotFittedError

app = FastAPI(title='VASUNDHARA ForestGreen AI Service')


class RiskScoreRequest(BaseModel):
    parcel_area_hectare: float = Field(gt=0, description='Parcel area in hectares')
    affected_families: int = Field(ge=0, description='Count of affected families')
    objection_count: int = Field(ge=0, description='Number of objections/claims')
    compensation_budget_cr: float = Field(gt=0, description='Compensation budget in crores')
    district_backlog_cases: int = Field(ge=0, description='Pending acquisition cases in district')


class RiskScoreResponse(BaseModel):
    risk_score: float
    average_delay_days: float
    remark: str
    model: str
    dataset: str


class _ModelBundle:
    def __init__(self, risk_model: RandomForestRegressor, delay_model: RandomForestRegressor):
        self.risk_model = risk_model
        self.delay_model = delay_model


@lru_cache(maxsize=1)
def load_models() -> _ModelBundle:
    dataset = fetch_california_housing()
    x = dataset.data

    scale = np.max(x, axis=0) + 1e-6
    x_scaled = x / scale

    risk_target = (
        45.0 * x_scaled[:, 0]
        + 20.0 * x_scaled[:, 5]
        + 15.0 * x_scaled[:, 6]
        + 20.0 * x_scaled[:, 7]
    )
    risk_target = np.clip(risk_target * 1.5, 5.0, 98.0)

    delay_target = (
        20.0
        + (x_scaled[:, 0] * 30.0)
        + (x_scaled[:, 5] * 24.0)
        + (x_scaled[:, 6] * 18.0)
        + (x_scaled[:, 7] * 15.0)
    )
    delay_target = np.clip(delay_target, 7.0, 210.0)

    risk_model = RandomForestRegressor(
        n_estimators=300,
        max_depth=14,
        random_state=42,
        min_samples_leaf=2,
    )
    delay_model = RandomForestRegressor(
        n_estimators=300,
        max_depth=14,
        random_state=24,
        min_samples_leaf=2,
    )

    risk_model.fit(x_scaled, risk_target)
    delay_model.fit(x_scaled, delay_target)

    return _ModelBundle(risk_model=risk_model, delay_model=delay_model)


def _to_model_features(payload: RiskScoreRequest) -> np.ndarray:
    area = payload.parcel_area_hectare
    families = float(payload.affected_families)
    objections = float(payload.objection_count)
    budget = payload.compensation_budget_cr
    backlog = float(payload.district_backlog_cases)

    people_pressure = families / max(area, 0.1)
    conflict_ratio = objections / max(families, 1.0)
    budget_pressure = area / max(budget, 0.2)

    features = np.array([
        area / 1000.0,
        families / 3000.0,
        budget / 200.0,
        people_pressure / 300.0,
        conflict_ratio,
        budget_pressure,
        backlog / 5000.0,
        (objections + backlog * 0.2) / 5000.0,
    ])

    return features.reshape(1, -1)


def _remark(risk_score: float, delay_days: float) -> str:
    if risk_score >= 75 or delay_days >= 140:
        return 'High risk: prioritize legal resolution, budget release, and field verification.'
    if risk_score >= 45 or delay_days >= 70:
        return 'Moderate risk: closely monitor objections, payments, and inter-department approvals.'
    return 'Low risk: maintain current workflow cadence and continue periodic monitoring.'


@app.get('/')
def root() -> dict[str, str]:
    return {'message': 'VASUNDHARA ForestGreen AI service is running'}


@app.post('/score', response_model=RiskScoreResponse)
def score(payload: RiskScoreRequest) -> RiskScoreResponse:
    try:
        models = load_models()
    except Exception as error:  # pragma: no cover
        raise RuntimeError('Unable to load online training dataset for ForestGreen AI') from error

    features = _to_model_features(payload)

    try:
        risk_prediction = float(models.risk_model.predict(features)[0])
        delay_prediction = float(models.delay_model.predict(features)[0])
    except NotFittedError as error:  # pragma: no cover
        raise RuntimeError('ForestGreen AI model is not initialized') from error

    risk_score = max(0.0, min(100.0, round(risk_prediction, 2)))
    average_delay_days = max(0.0, round(delay_prediction, 2))

    return RiskScoreResponse(
        risk_score=risk_score,
        average_delay_days=average_delay_days,
        remark=_remark(risk_score, average_delay_days),
        model='ForestGreen Random Forest Ensemble',
        dataset='scikit-learn California Housing (online fetch)',
    )
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )