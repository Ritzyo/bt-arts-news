from flask import Flask, request, jsonify
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
def predict_bias(article):
    num_features = 50
    vectorizer = TfidfVectorizer(max_features=num_features)
    text_matrix = vectorizer.fit_transform([article])
    vectorized_article = np.ravel(text_matrix.toarray())

    filename = 'finalized_model.sav'
    loaded_model = pickle.load(open(filename, 'rb'))
    prediction = loaded_model.predict_proba([vectorized_article])
    return prediction[0]

@app.route('/predict-bias')
def predict_bias_endpoint():
    try:
        article = request.args.get('article')

        if article is None:
            return jsonify({'error': 'Missing article parameter'})
        
        article = article.strip()

        prediction = predict_bias(article)
        print(prediction)

        res = jsonify({'dem_percentage': prediction[0],
                       'rep_percentage': prediction[1]})
        print(res)

        return res

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
