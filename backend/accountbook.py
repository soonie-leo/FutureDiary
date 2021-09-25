from datetime import datetime

from db import AccountBook, Asset


def get(db):
    data = []
    for row in db.session.query(AccountBook).all():
        data.append({
            'id': row.id,
            'date': row.date.strftime('%Y. %m. %d. %H:%M:%S'),
            'content': row.content,
            'income': row.income,
            'expense': row.expense,
            'category': row.category,
            'memo': row.memo
        })

    return {
        'success': True,
        'data': data
    }


def insert(db, date, content, income, expense, category, memo):
    missingParams = []
    if not date:
        missingParams.append('date')
    if not content:
        missingParams.append('content')
    if not income:
        missingParams.append('income')
    if not expense:
        missingParams.append('expense')
    if not category:
        missingParams.append('category')
    if not memo:
        missingParams.append('memo')

    if len(missingParams) > 0:
        return {
            'success': False,
            'message': f"Error: {','.join(missingParams)} 파라미터가 포함되어야 합니다."
        }

    if content == '':
        return {
            'success': False,
            'message': 'Error: content 파라미터가 빈 값입니다.'
        }

    if income == '0' and expense == '0':
        return {
            'success': False,
            'message': 'Error: income과 expense가 모두 "0"일 수는 없습니다.'
        }

    try:
        date = datetime.strptime(date, '%Y. %m. %d. %H:%M:%S')
        accountBook = AccountBook(date, content, income, expense, category, memo)
        db.session.add(accountBook)
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
        targetAccountBook = db.session.query(AccountBook).filter_by(id=id).first()
        db.session.delete(targetAccountBook)
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
    

def update(db, id, date, content, income, expense, category, memo):
    try:
        target = db.session.query(AccountBook).filter_by(id=id).first()
        if date:
            date = datetime.strptime(date, '%Y. %m. %d. %H:%M:%S')
            target.date = date
        if content:
            target.content = content
        if income:
            target.income = income
        if expense:
            target.expense = expense
        if category:
            target.category = category
        if memo:
            target.memo = memo

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
