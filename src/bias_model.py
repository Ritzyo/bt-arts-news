import warnings
warnings.simplefilter("ignore")

import pandas as pd
import numpy as np

from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV
from sklearn.model_selection import cross_val_score

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.utils._testing import ignore_warnings
from sklearn.exceptions import ConvergenceWarning
from sklearn.neural_network import MLPClassifier

import pickle

def vectorize_text(text, max_features):
    vectorizer = TfidfVectorizer(max_features=max_features)  # Adjust max_features based on your desired vector size
    text_matrix = vectorizer.fit_transform([text])
    text_vector = np.ravel(text_matrix.toarray())
    return text_vector

# input_text = "President-elect Javier Milei is quickly toning down his aggressive rhetoric toward Argentina’s largest trading partners, raising the prospect that his administration may not be so disruptive for international affairs after all. After calling the Chinese government an assassin during an August interview with Bloomberg News and saying he wouldn’t keep relations with Brazil or countries led by communists if elected, Milei sounded surprisingly cordial in comments made just a few days after his landslide Nov. 19 win. He sent well-wishes to the Chinese people in a social media post Wednesday, thanking President Xi Jinping for a letter in which he congratulated the Argentine leader for his victory and reminded him that relations between Beijing and Buenos Aires were always based on \"mutual respect,\" with \"tangible benefits\" for both sides. Also on Wednesday he told a local TV that Brazil’s Luiz Inacio Lula da Silva would \"be welcome\" to attend his Dec. 10 inauguration. And he even patched differences with Pope Francis, an Argentine he once described as the devil’s man on earth. When receiving a call from the Vatican on Tuesday, Milei invited His Holiness to visit Argentina soon. Read More: Lula Gives Milei the Cold Shoulder on Bet He’ll Need Brazil The about-face is the latest sign yet that the foul-mouthed libertarian who swept to power with radical promises to fix Argentina’s problems may be adopting a more pragmatic approach, at least in foreign policy, as he prepares to take office. “It was inevitable, Argentina simply can’t afford to alienate its most important trading partners,” said Benjamin Gedan, director of the Wilson Center’s Latin America Program. \"It seems clear that Milei is following the advice of his more pragmatic advisers when it comes to foreign policy, including former President Mauricio Macri. Argentina’s total trade with China and Brazil reached $55 billion last year, almost three times as much its commerce with the US, its third-largest trading partner. Read More: Milei’s Economic Team Led by Former Head of Macri’s Central Bank Diana Mondino, Milei’s incoming foreign minister, said during a TV interview Wednesday that the president-elect had never proposed breaking relations with China or Brazil, blaming the media and the opposition for taking his comments out of context. \“There’s no breaking or changing or freezing\” relations, she said in that interview. \"There can never be.\" Mondino, an economist and close adviser to Milei throughout the campaign, added that Lula will \"of course\" be invited to the inauguration. \"Why wouldn’t he come?\" One issue complicating a potential visit by Lula is the expected presence of his political adversary Jair Bolsonaro in the ceremony. The former Brazilian president is friends with Milei and, while calling him after his election victory, gladly accepted a personal invitation to attend his inauguration in Buenos Aires. From the US, Milei received a congratulatory call from President Joe Biden, who won’t be able to come to Buenos Aires due to previously scheduled commitments, according to Mondino. But on Thursday Milei’s office said he also spoke by phone with Donald Trump, who confirmed his presence in the inauguration."
# vectorized_text = vectorize_text(input_text, 30)

# print("Vectorized Text:")
# print(vectorized_text)

# read in data and convert text to vectorized values in same df
text_data = pd.read_csv("./article_political-affiliation_dataset.csv", header='infer')
num_features = 50

# for each value in the 'article' column of text_data, read the string and convert it to a vectorized value
vectorized_values = []
for i in range(len(text_data['article'])):
    vectorized_values.append(vectorize_text(text_data['article'][i], num_features))

# add vectorized values to text_data so that we add num_features more columns to the dataframe
for i in range(num_features - 1, -1, -1):
    text_data.insert(0, f'feature_{i}', [vectorized_values[j][i] for j in range(len(vectorized_values))])

# remove the original article column
text_data.drop(columns=['article'], inplace=True)

# NN model

# grab the feature_i columns as the features and the last column as the labels
features = text_data.drop(columns=['political_affiliation'])
political_labels = text_data['political_affiliation']

scaler = StandardScaler()

@ignore_warnings(category=ConvergenceWarning) # used to hide irrelevant warnings
def run_nn():
    mlp = MLPClassifier()
    pipeline = Pipeline(steps=[('scaler', scaler), ('mlp', mlp)])

    hidden_layer_sizes = []
    for hidden_layer_size in range(1, num_features, 2): # 1, num_features, 2
        hidden_layer_sizes.append((hidden_layer_size,))
        hidden_layer_sizes.append((hidden_layer_size,hidden_layer_size))

    param_grid = {
        'mlp__hidden_layer_sizes': hidden_layer_sizes, # want to try both single and multilayer for the mlp
        'mlp__activation': ['logistic', 'tanh', 'relu'] # want to try all the non-trivial activation functions sklearn provides
    }

    model = GridSearchCV(pipeline, param_grid, cv=5)
    model.fit(features, political_labels)

    print(f"Best hidden layer size: {model.best_params_['mlp__hidden_layer_sizes']}")
    print(f"Best activation function: {model.best_params_['mlp__activation']}")
    print(f"Accuracy when using the best parameters: {model.best_score_}")
    print()

    scores = cross_val_score(model, features, political_labels, cv=5)
    average_accuracy = scores.mean() * 100
    print(f"Average Accuracy: {average_accuracy}")

    filename = 'finalized_model.sav'
    pickle.dump(model, open(filename, 'wb'))

# train model (FINISH GETTING DATA)
run_nn()
