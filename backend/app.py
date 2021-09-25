import os
import json
import logging
from logging.handlers import RotatingFileHandler

from flask import Flask, request
from db import db

import accountbook
import asset
import target


basdir = os.path.abspath(os.path.dirname(__file__))
dbfile = os.path.join(basdir, 'db.sqlite')

handler = RotatingFileHandler('logs/app.log', maxBytes=10000000, backupCount=1)
formatter = logging.Formatter("[%(asctime)s] %(levelname)s - %(message)s")
handler.setLevel(logging.DEBUG)
handler.setFormatter(formatter)

app = Flask(__name__)
app.logger.addHandler(handler)

# SQLAlchemy 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + dbfile
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = 'jqiowejrojzxcovnklqnweiorjqwoijroi'

db.init_app(app)
db.app = app
db.create_all()


@app.route('/api/accountbook')
def getAccountBook():
    app.logger.info('GET /api/accountbook')
    return accountbook.get(db)


@app.route('/api/accountbook', methods=['POST'])
def insertAccountBook():
    app.logger.info('POST /api/accountbook')

    date = request.form.get('date', None)
    content = request.form.get('content', None)
    income = request.form.get('income', None)
    expense = request.form.get('expense', None)
    category = request.form.get('category', None)
    memo = request.form.get('memo', None)

    loggingData = {
        date: str(date or 'None'),
        content: str(content or 'None'),
        income: str(income or 'None'),
        expense: str(expense or 'None'),
        category: str(category or 'None'),
        memo: str(memo or 'None')
    }
    app.logger.info(f'params: {json.dumps(loggingData, ensure_ascii=False)}')

    return accountbook.insert(db, date, content, income, expense, category, memo)


@app.route('/api/accountbook/<int:id>', methods=['DELETE'])
def deleteAccountBook(id):
    app.logger.info(f'DELETE /api/accountbook/{id}')
    return accountbook.delete(db, id)


@app.route('/api/accountbook/<int:id>', methods=['PUT'])
def updateAccountBook(id):
    app.logger.info(f'PUT /api/accountbook/{id}')

    date = request.form.get('date', None)
    content = request.form.get('content', None)
    income = request.form.get('income', None)
    expense = request.form.get('expense', None)
    category = request.form.get('category', None)
    memo = request.form.get('memo', None)

    loggingData = {
        date: str(date or 'None'),
        content: str(content or 'None'),
        income: str(income or 'None'),
        expense: str(expense or 'None'),
        category: str(category or 'None'),
        memo: str(memo or 'None')
    }
    app.logger.info(f'params: {json.dumps(loggingData, ensure_ascii=False)}')

    return accountbook.update(db, id, date, content, income, expense, category, memo)


@app.route('/api/asset')
def getAssetLast():
    app.logger.info('GET /api/asset')
    return asset.get(db)


@app.route('/api/asset', methods=['POST'])
def insertAsset():
    app.logger.info('POST /api/asset')

    date = request.form.get('date', None)
    netAsset = request.form.get('netAsset', None)
    loan = request.form.get('loan', None)
    realty = request.form.get('realty', None)
    stock = request.form.get('stock', None)
    cash = request.form.get('cash', None)

    loggingData = {
        date: str(date or 'None'),
        netAsset: str(netAsset or 'None'),
        loan: str(loan or 'None'),
        realty: str(realty or 'None'),
        stock: str(stock or 'None'),
        cash: str(cash or 'None')
    }
    app.logger.info(f'params: {json.dumps(loggingData, ensure_ascii=False)}')

    return asset.insert(db, date, netAsset, loan, realty, stock, cash)


@app.route('/api/asset/<int:id>', methods=['DELETE'])
def deleteAsset(id):
    app.logger.info(f'DELETE /api/asset/{id}')
    return asset.delete(db, id)


@app.route('/api/asset/<int:id>', methods=['PUT'])
def updateAsset(id):
    app.logger.info(f'PUT /api/asset/{id}')

    date = request.form.get('date', None)
    netAsset = request.form.get('netAsset', None)
    loan = request.form.get('loan', None)
    realty = request.form.get('realty', None)
    stock = request.form.get('stock', None)
    cash = request.form.get('cash', None)

    loggingData = {
        date: str(date or 'None'),
        netAsset: str(netAsset or 'None'),
        loan: str(loan or 'None'),
        realty: str(realty or 'None'),
        stock: str(stock or 'None'),
        cash: str(cash or 'None')
    }
    app.logger.info(f'params: {json.dumps(loggingData, ensure_ascii=False)}')

    return asset.update(db, id, date, netAsset, loan, realty, stock, cash)


@app.route('/api/target')
def getTarget():
    app.logger.info('GET /api/target')
    return target.get(db)


@app.route('/api/target', methods=['POST'])
def insertTarget():
    app.logger.info('POST /api/target')

    annualAsset = request.form.get('annualAsset', None)
    monthlyIncome = request.form.get('monthlyIncome', None)
    monthlyConsumption = request.form.get('monthlyConsumption', None)

    loggingData = {
        annualAsset: str(annualAsset or 'None'),
        monthlyIncome: str(monthlyIncome or 'None'),
        monthlyConsumption: str(monthlyConsumption or 'None')
    }
    app.logger.info(f'params: {json.dumps(loggingData, ensure_ascii=False)}')

    return target.insert(db, annualAsset, monthlyIncome, monthlyConsumption)


@app.route('/api/target/<int:id>', methods=['DELETE'])
def deleteTarget(id):
    app.logger.info(f'DELETE /api/target/{id}')
    return target.delete(db, id)


@app.route('/api/target/<int:id>', methods=['PUT'])
def updateTarget(id):
    app.logger.info(f'PUT /api/target/{id}')

    annualAsset = request.form.get('annualAsset', None)
    monthlyIncome = request.form.get('monthlyIncome', None)
    monthlyConsumption = request.form.get('monthlyConsumption', None)

    loggingData = {
        annualAsset: str(annualAsset or 'None'),
        monthlyIncome: str(monthlyIncome or 'None'),
        monthlyConsumption: str(monthlyConsumption or 'None')
    }
    app.logger.info(f'params: {json.dumps(loggingData, ensure_ascii=False)}')

    return target.update(db, id, annualAsset, monthlyIncome, monthlyConsumption)
