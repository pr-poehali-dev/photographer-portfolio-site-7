import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    '''Создаёт подключение к базе данных'''
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    '''API для работы с портфолио фотографа: получение фотографий, отзывов и услуг'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        action = query_params.get('action', 'portfolio')
        
        if action == 'portfolio':
            category = query_params.get('category', 'all')
            
            if category == 'all':
                cur.execute('''
                    SELECT id, title, url, category, description, display_order
                    FROM portfolio_images
                    ORDER BY display_order ASC
                ''')
            else:
                cur.execute('''
                    SELECT id, title, url, category, description, display_order
                    FROM portfolio_images
                    WHERE category = %s
                    ORDER BY display_order ASC
                ''', (category,))
            
            images = [dict(row) for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'images': images}),
                'isBase64Encoded': False
            }
        
        elif action == 'reviews':
            cur.execute('''
                SELECT id, client_name, review_text, rating, created_at
                FROM reviews
                WHERE is_published = true
                ORDER BY created_at DESC
            ''')
            
            reviews = [dict(row) for row in cur.fetchall()]
            for review in reviews:
                if review.get('created_at'):
                    review['created_at'] = review['created_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'reviews': reviews}),
                'isBase64Encoded': False
            }
        
        elif action == 'services':
            cur.execute('''
                SELECT id, title, description, price_from, icon_name, display_order
                FROM services
                WHERE is_active = true
                ORDER BY display_order ASC
            ''')
            
            services = [dict(row) for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'services': services}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and action == 'submit_review':
            body = json.loads(event.get('body', '{}'))
            client_name = body.get('client_name', '').strip()
            review_text = body.get('review_text', '').strip()
            rating = body.get('rating', 5)
            
            if not client_name or not review_text:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Имя и текст отзыва обязательны'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                INSERT INTO reviews (client_name, review_text, rating, is_published)
                VALUES (%s, %s, %s, false)
                RETURNING id
            ''', (client_name, review_text, rating))
            
            review_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Отзыв отправлен на модерацию', 'id': review_id}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Эндпоинт не найден'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()