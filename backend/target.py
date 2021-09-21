from db import Target


def get(db):
    row = db.session.query(Target).first()
    if row:
      data = {
          'id': row.id,
          'annualAsset': row.annualAsset,
          'monthlyIncome': row.monthlyIncome,
          'monthlyConsumption': row.monthlyConsumption
      }

      return {
          'success': True,
          'data': data
      }
    else:
      return {
          'success': False,
          'data': {}
      }


def insert(db, annualAsset, monthlyIncome, monthlyConsumption):
    missingParams = []
    if not annualAsset:
        missingParams.append('annualAsset')
    if not monthlyIncome:
        missingParams.append('monthlyIncome')
    if not monthlyConsumption:
        missingParams.append('monthlyConsumption')

    if len(missingParams) > 0:
        return {
            'success': False,
            'message': f"Error: {','.join(missingParams)} 파라미터가 포함되어야 합니다."
        }

    try:
        target = Target(annualAsset, monthlyIncome, monthlyConsumption)
        db.session.add(target)
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
        db.session.query(Target).filter_by(id=id).delete()
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


def update(db, id, annualAsset, monthlyIncome, monthlyConsumption):
    try:
        target = db.session.query(Target).first()
        if annualAsset:
            target.annualAsset = annualAsset
        if monthlyIncome:
            target.monthlyIncome = monthlyIncome
        if monthlyConsumption:
            target.monthlyConsumption = monthlyConsumption

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
