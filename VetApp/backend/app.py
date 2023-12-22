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
            rec1 = Rec1_cnn.predict(entrada)
            #print(rec1)
            recipiente1 = np.argmax(rec1)
            #print(recipiente1)

            # Predicción de Recipiente2:
            rec2 = Rec2_cnn.predict(entrada)
            #print(rec2)
            recipiente2 = np.argmax(rec2)
            #print(recipiente2)

            # Predicción de Recipiente3:
            rec3 = Rec3_cnn.predict(entrada)
            recipiente3 = np.argmax(rec3)
            #print(recipiente3)

            # Predicción de Cantidad:

            cant = Cant_cnn.predict(entrada)
            cantidad = np.argmax(cant)
            #print(cantidad)

            # Predicción de Temperatura:

            temp = Temp_cnn.predict(entrada)
            temperatura = np.argmax(temp)
            #print(temperatura)

            # Predicción de Tiempo:

            tmp = Time_cnn.predict(entrada)
            tiempo = np.argmax(tmp)
            #print(tiempo)

            # Predicción de Condiciones:
            
            cond = Cond_cnn.predict(entrada)
            condiciones = np.argmax(cond)
            #print(condiciones)


            #print(recipiente1,recipiente2,recipiente3,cantidad,temperatura,tiempo,condiciones)



            tubox =csv.iloc[:,10]
            aux=np.ravel(tubox)
            tubo=np.unique(aux)
            recipiente1 = tubo[recipiente1]
            #print(recipiente1)


            tubo2 =csv.iloc[:,11]
            aux2=np.ravel(tubo2)
            tubo2=np.unique(aux2)
            recipiente2 = tubo2[recipiente2]
            #print(recipiente2)

            tubo3 =csv.iloc[:,12]
            aux3=np.ravel(tubo3)
            tubo3=np.unique(aux3)
            recipiente3 = tubo3[recipiente3]
            #print(recipiente3)


            cantidadx=csv.iloc[:,13]
            aux=np.ravel(cantidadx)
            cant=np.unique(aux)
            cantidadaux=[]
            for i in cant:
                cantidadaux.append(i.replace(',','.'))
            cant=cantidadaux
            cant=[float(elemento) for elemento in cant]
            cantidad = cant[cantidad]
            #print(cantidad)


            
            temp =csv.iloc[:,14]
            aux4=np.ravel(temp)
            temp=np.unique(aux4)
            temperatura = temp[temperatura]
            #print(temperatura)


            
            time =csv.iloc[:,15]
            aux5=np.ravel(time)
            time=np.unique(aux5)
            tiempo = time[tiempo]
            #print(tiempo)


            condic =csv.iloc[:,16]
            aux6=np.ravel(condic)
            condic=np.unique(aux6)
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
