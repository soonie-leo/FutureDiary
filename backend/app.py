import os

from flask import Flask, request
from db import db

import accountbook
import asset

# 현재있는 파일의 디렉토리 절대경로
basdir = os.path.abspath(os.path.dirname(__file__))
# basdir 경로안에 DB파일 만들기
dbfile = os.path.join(basdir, 'db.sqlite')

app = Flask(__name__)

# SQLAlchemy 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + dbfile
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'jqiowejrojzxcovnklqnweiorjqwoijroi'

db.init_app(app)
db.app = app
db.create_all()


@app.route('/api/accountbook')
def getAccountBook():
    return accountbook.get(db)


@app.route('/api/accountbook', methods=['POST'])
def insertAccountBook():
    date = request.form.get('date', None)
    content = request.form.get('content', None)
    income = request.form.get('income', None)
    expense = request.form.get('expense', None)
    category = request.form.get('category', None)
    memo = request.form.get('memo', None)

    return accountbook.insert(db, date, content, income, expense, category, memo)


@app.route('/api/accountbook/<int:id>', methods=['DELETE'])
def deleteAccountBook(id):
    return accountbook.delete(db, id)


@app.route('/api/accountbook/<int:id>', methods=['PUT'])
def updateAccountBook(id):
    date = request.form.get('date', None)
    content = request.form.get('content', None)
    income = request.form.get('income', None)
    expense = request.form.get('expense', None)
    category = request.form.get('category', None)
    memo = request.form.get('memo', None)

    return accountbook.update(db, id, date, content, income, expense, category, memo)


@app.route('/api/asset')
def getAsset():
    return asset.get(db)


@app.route('/api/asset', methods=['POST'])
def insertAsset():
    date = request.form.get('date', None)
    netAsset = request.form.get('netAsset', None)
    loan = request.form.get('loan', None)
    realty = request.form.get('realty', None)
    stock = request.form.get('stock', None)
    cash = request.form.get('cash', None)

    return asset.insert(db, date, netAsset, loan, realty, stock, cash)


@app.route('/api/asset/<int:id>', methods=['DELETE'])
def deleteAsset(id):
    return asset.delete(db, id)


@app.route('/api/asset/<int:id>', methods=['PUT'])
def updateAsset(id):
    date = request.form.get('date', None)
    netAsset = request.form.get('netAsset', None)
    loan = request.form.get('loan', None)
    realty = request.form.get('realty', None)
    stock = request.form.get('stock', None)
    cash = request.form.get('cash', None)

    return accountbook.update(db, id, date, netAsset, loan, realty, stock, cash)
