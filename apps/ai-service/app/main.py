from fastapi import FastAPI

app = FastAPI(title='VASUNDHARA AI Service - Placeholder')

@app.get('/')
def root():
    return {"message": "AI service - IMPLEMENTATION PENDING"}

@app.post('/score')
def score():
    # TODO: implement risk scoring endpoint
    return {"message":"IMPLEMENTATION PENDING"}
