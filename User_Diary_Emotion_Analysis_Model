import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer

data = pd.read_csv('Emotion_Dataset.csv', encoding='ISO-8859-1')

#Encode the labels to 0,1,2,3...
label_encoder = LabelEncoder()
data['emotion'] = label_encoder.fit_transform(data['Emotion'])

#Vectorize the texts by using TF-IDF Scores
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(data['Text'])
y = data['emotion']

#Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#Train the model
model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

joblib.dump(model, 'logistic_regression_model.pkl')
joblib.dump(vectorizer, 'tfidf_vectorizer.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')
