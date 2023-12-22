from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import pandas as pd
import numpy as np
from PIL import Image
from flask_cors import CORS  # Importa la extensión CORS

def unicos(Columna,nombrecol):
    planar=np.ravel(Columna)
    arreglo=np.unique(planar)
    #print(arreglo)
    arreglo = np.delete(arreglo, np.where(arreglo == 'nada'))
    #print(arreglo)
    arreglo = np.sort(arreglo)
    #print(arreglo)
    #print(nombrecol)
    if(nombrecol not in ['raza','tipomuestra']):
        arreglo = np.insert(arreglo, 0, 'nada', axis=0)
        
    return arreglo.tolist()

def unicosPred(Columna):
    planar=np.ravel(Columna)
    arreglo=np.unique(planar)

    return arreglo

def pred(input,modelo):

    pred = modelo.predict(input)
    #print(pred)
    prediccion = np.argmax(pred)
    #print(prediccion)
    return prediccion
app = Flask(__name__)
CORS(app)

csv=pd.read_csv('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend/Models/Dataset/muestras normalizadas.csv')

Rec1_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend/Models/Recipiente1.h5')
Rec2_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend/Models/Recipiente2.h5')
Rec3_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend/Models/Recipiente3.h5')
Cant_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend/Models/Cantidad.h5')
Temp_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend/Models/Temperatura.h5')
Time_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend/Models/Tiempo.h5')
Cond_cnn = load_model('C:/Users/daagu/Desktop/Proyecto Veterinaria/VetApp/backend/Models/Condiciones.h5')

@app.route('/upla', methods=['POST'])
def upload():
    if request.method == 'POST':
        try:
            data = request.json.get('data', [])

            # Verificar si data es un entero, y convertirlo a una lista si es necesario
            if isinstance(data, int):
                data = [data]

            arreglo = data
            #print("Datos de entrada:", arreglo)

            xi=[0,0,0,0,0,0,0,0,0,0]
            for i in range(0,10):
                xi[i]=csv.iloc[:,i]
                aux=np.ravel(xi[i])
                xi[i]=np.unique(aux)

            input=[]
            for numero,i in enumerate(arreglo):
                for indice,valor in enumerate(xi[numero]):

                    if(i==valor):
                        #print(i)
                        input.append(indice)
            entrada=[]
            entrada.append(input)
            #print(entrada)
    
            # Predicción de Recipiente1:
            recipiente1 = pred(entrada,Rec1_cnn)

            # Predicción de Recipiente2:
            recipiente2 = pred(entrada,Rec2_cnn)

            # Predicción de Recipiente3:
            recipiente3 = pred(entrada,Rec3_cnn)

            # Predicción de Cantidad:
            cantidad = pred(entrada,Cant_cnn)

            # Predicción de Temperatura:
            temperatura = pred(entrada,Temp_cnn)

            # Predicción de Tiempo:
            tiempo = pred(entrada,Time_cnn)

            # Predicción de Condiciones:
            condiciones = pred(entrada,Cond_cnn)
            #print(recipiente1,recipiente2,recipiente3,cantidad,temperatura,tiempo,condiciones)

            tubo =unicosPred(csv.iloc[:,10])
            recipiente1 = tubo[recipiente1]
            #print(recipiente1)
            tubo2 = unicosPred(csv.iloc[:,11])
            recipiente2 = tubo2[recipiente2]
            #print(recipiente2)

            tubo3 =unicosPred(csv.iloc[:,12])
            recipiente3 = tubo3[recipiente3]
            #print(recipiente3)

            cant=unicosPred(csv.iloc[:,13])
            cantidadaux=[]
            for i in cant:
                cantidadaux.append(i.replace(',','.'))
            cant=cantidadaux
            cant=[float(elemento) for elemento in cant]
            cantidad = cant[cantidad]
            #print(cantidad)

            temp = unicosPred(csv.iloc[:,14])
            temperatura = temp[temperatura]
            #print(temperatura)

            time =unicosPred(csv.iloc[:,15])
            tiempo = time[tiempo]
            #print(tiempo)

            condic = unicosPred(csv.iloc[:,16])
            condiciones = condic[condiciones]
            #print(condiciones)


            #print(recipiente1,recipiente2,recipiente3,cantidad,temperatura,tiempo,condiciones)


            respuesta = {
                    "message": "Datos recibidos correctamente.",
                    "recipiente1": recipiente1,
                    "recipiente2": recipiente2,
                    "recipiente3": recipiente3,
                    "cantidad": float(cantidad),
                    "temperatura": temperatura,
                    "tiempo": int(tiempo),
                    "condiciones": condiciones
            }
            #print({recipiente1,recipiente2,recipiente3,cantidad,temperatura,tiempo,condiciones})            
            return respuesta


        except Exception as e:
            return jsonify({"error": str(e)})

    return jsonify({"error": "Solicitud incorrecta"})

@app.route('/get', methods=['GET'])
def get():
    if request.method == 'GET':
        try:
            
            raza = unicos(csv.iloc[:,1],'raza')
            enfermedad1 = unicos(csv.iloc[:,5],'enfermedad1')
            enfermedad2 = unicos(csv.iloc[:,6],'enfermedad2')
            enfermedad3 = unicos(csv.iloc[:,7],'enfermedad3')
            enfermedad4 = unicos(csv.iloc[:,8],'enfermedad4')
            tipo_muestra = unicos(csv.iloc[:,9],'tipomuestra')
            
            respuesta = {
                "razas"  : raza,
                "enfermedad1" : enfermedad1,
                "enfermedad2" : enfermedad2,
                "enfermedad3" : enfermedad3,
                "enfermedad4" : enfermedad4,
                "tipoMuestra" : tipo_muestra
            }
            return jsonify(respuesta)

        except Exception as e:
            return jsonify({"error": str(e)})

    return jsonify({"error": "Solicitud incorrecta"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
