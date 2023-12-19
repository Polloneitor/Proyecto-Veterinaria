from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import pandas as pd
import numpy as np
from PIL import Image
from flask_cors import CORS  # Importa la extensión CORS


app = Flask(__name__)
CORS(app)

csv=pd.read_csv('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend/Models/Dataset/muestras normalizadas.csv')

Rec1_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend\Models/Recipiente1.h5')
Rec2_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend\Models/Recipiente2.h5')
Rec3_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend\Models/Recipiente3.h5')
Cant_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend\Models/Cantidad.h5')
Temp_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend\Models/Temperatura.h5')
Time_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend\Models/Tiempo.h5')
Cond_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend\Models/Condiciones.h5')

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        try:
            data = request.json.get('data', [])

            # Verificar si data es un entero, y convertirlo a una lista si es necesario
            if isinstance(data, int):
                data = [data]

            arreglo = data
            xi = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            for i in range(0, 10):
                xi[i] = arreglo[i]
                aux = np.ravel(xi[i])
                xi[i] = np.unique(aux)

            input = []
            for numero, i in enumerate(arreglo):
                for indice, valor in enumerate(xi[numero]):
                    if i == valor:
                        input.append(indice)

            entrada = [input]
            # Predicción de Recipiente1:
            
            rec1 = Rec1_cnn.predict(entrada)
            recipiente1 = np.argmax(rec1)

            # Predicción de Recipiente2:

            rec2 = Rec2_cnn.predict(entrada)
            recipiente2 = np.argmax(rec2)

            # Predicción de Recipiente3:

            rec3 = Rec3_cnn.predict(entrada)
            recipiente3 = np.argmax(rec3)

            # Predicción de Cantidad:

            cant = Cant_cnn.predict(entrada)
            cantidad = np.argmax(cant)

            # Predicción de Temperatura:

            temp = Temp_cnn.predict(entrada)
            temperatura = np.argmax(temp)

            # Predicción de Tiempo:

            tmp = Time_cnn.predict(entrada)
            tiempo = np.argmax(tmp)

            # Predicción de Condiciones:
            
            cond = Cond_cnn.predict(entrada)
            condiciones = np.argmax(cond)


            tubox =csv.iloc[:,10]
            aux=np.ravel(tubox)
            tubo=np.unique(aux)
            recipiente1 = tubo[recipiente1]
            print(recipiente1)


            tubo2 =csv.iloc[:,11]
            aux2=np.ravel(tubo2)
            tubo2=np.unique(aux2)
            recipiente2 = tubo2[recipiente2]
            print(recipiente2)

            tubo3 =csv.iloc[:,12]
            aux3=np.ravel(tubo3)
            tubo3=np.unique(aux3)
            recipiente3 = tubo3[recipiente3]
            print(recipiente3)


            cantidadx=csv.iloc[:,13]
            aux=np.ravel(cantidadx)
            cant=np.unique(aux)
            cantidadaux=[]
            for i in cant:
                cantidadaux.append(i.replace(',','.'))
            cant=cantidadaux
            cant=[float(elemento) for elemento in cant]
            cant.sort()
            cantidad = cant[cantidad]
            print(cantidad)

            
            temp =csv.iloc[:,14]
            aux4=np.ravel(temp)
            temp=np.unique(aux4)
            temperatura = temp[temperatura]
            print(temperatura)


            
            time =csv.iloc[:,15]
            aux5=np.ravel(time)
            time=np.unique(aux5)
            tiempo = time[tiempo]
            print(tiempo)


            condic =csv.iloc[:,16]
            aux6=np.ravel(condic)
            condic=np.unique(aux6)
            condiciones = condic[condiciones]
            print(condiciones)



            respuesta = {
                    "message": "Datos recibidos correctamente.",
                    "recipiente1": recipiente1,
                    "recipiente2": recipiente2,
                    "recipiente3": recipiente3,
                    "cantidad": int(cantidad),
                    "temperatura": temperatura,
                    "tiempo": int(tiempo),
                    "condiciones": condiciones
            }
            print({recipiente1,recipiente2,recipiente3,cantidad,temperatura,tiempo,condiciones})            
            return respuesta

        except Exception as e:
            return jsonify({"error": str(e)})

    return jsonify({"error": "Solicitud incorrecta"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
