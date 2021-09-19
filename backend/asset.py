from datetime import datetime

from db import Asset


def get(db):
    data = []
    for row in db.session.query(Asset).all():
        data.append({
            'id': row.id,
            'date': row.date,
            'netAsset': row.netAsset,
            'loan': row.loan,
            'realty': row.realty,
            'stock': row.stock,
            'cash': row.cash
        })

    return {
        'success': True,
        'data': data
    }


def insert(db, date, netAsset, loan, realty, stock, cash):
    missingParams = []
    if not date:
        missingParams.append('date')
    if not netAsset:
        missingParams.append('netAsset')
    if not loan:
        missingParams.append('loan')
    if not realty:
        missingParams.append('realty')
    if not stock:
        missingParams.append('stock')
    if not cash:
        missingParams.append('cash')

    if len(missingParams) > 0:
        return {
            'success': False,
            'message': f"Error: {','.join(missingParams)} 파라미터가 포함되어야 합니다."
        }

    try:
        date = datetime.strptime(date, '%Y.%m.%d.')

        asset = Asset(date, netAsset, loan, realty, stock, cash)
        db.session.add(asset)
        db.session.commit()

    except Exception as e:
        return {
            'success': False,
            'message': f'Error: {e}'
        }

    return {
        'success': True,
        'message': 'OK'
    }


def delete(db, id):
    try:
        db.session.query(Asset).filter_by(id=id).delete()
        db.session.commit()
    except Exception as e:
        return {
            'success': False,
            'message': f'Error: {e}'
        }

    return {
        'success': True,
        'message': 'OK'
    }

def update(db, id, date, netAsset, loan, realty, stock, cash):
    try:
        target = db.session.query(Asset).filter_by(id=id).first()
        if date:
            target.date = date
        if netAsset:
            target.netAsset = netAsset
        if loan:
            target.loan = loan
        if realty:
            target.realty = realty
        if stock:
            target.stock = stock
        if cash:
            target.cash = cash

        db.session.commit()
    except Exception as e:
        return {
            'success': False,
            'message': f'Error: {e}'
        }
    
    return {
        'success': True,
        'message': 'OK'
    }
