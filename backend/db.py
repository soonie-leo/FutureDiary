from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class AccountBook(db.Model):
    __tablename__ = 'AccountBook'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime(timezone=True), nullable=False)
    content = db.Column(db.String(80), nullable=False)
    income = db.Column(db.Integer, nullable=False)
    expense = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(40), nullable=False)
    memo = db.Column(db.Text, nullable=False)

    def __init__(self, date, content, income, expense, category, memo):
        self.date = date
        self.content = content
        self.income = income
        self.expense = expense
        self.category = category
        self.memo = memo


class Asset(db.Model):
    __tablename__ = 'Asset'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime(timezone=True), nullable=False)
    netAsset = db.Column(db.Integer, nullable=False)
    loan = db.Column(db.Integer, nullable=False)
    realty = db.Column(db.Integer, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    cash = db.Column(db.Integer, nullable=False)

    def __init__(self, date, netAsset, loan, realty, stock, cash):
        self.date = date
        self.netAsset = netAsset
        self.loan = loan
        self.realty = realty
        self.stock = stock
        self.cash = cash


class Target(db.Model):
    __tablename__ = 'Target'

    id = db.Column(db.Integer, primary_key=True)
    annualAsset = db.Column(db.Integer, nullable=False)
    monthlyIncome = db.Column(db.Integer, nullable=False)
    monthlyConsumption = db.Column(db.Integer, nullable=False)

    def __init__(self, annualAsset, monthlyIncome, monthlyConsumption):
        self.annualAsset = annualAsset
        self.monthlyIncome = monthlyIncome
        self.monthlyConsumption = monthlyConsumption
