import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



function App() {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({
    raza: '',
    edad: 0,
    ayuno: 'si',
    peso: '',
    enfermedad1: 'nada',
    enfermedad2: 'nada',
    enfermedad3: 'nada',
    enfermedad4: 'nada',
    tipoMuestra: '',
  });
  const [datosGuardados, setDatosGuardados] = useState([]);
  const [opciones, setOpciones] = useState({
    razas: [],
    enfermedad1: [],
    enfermedad2: [],
    enfermedad3: [],
    enfermedad4: [],
    tipoMuestra: [],
  });

  useEffect(() => {
    // Hacer la solicitud GET al backend para obtener las opciones
    axios.get('http://localhost:5000/get')
      .then(response => {
        setOpciones(response.data);
        console.log('Opciones actualizadas:', response.data);
      })
      .catch(error => {
        console.error('Error al obtener opciones desde el servidor:', error);
      });
  }, []);

  const handleAnimalSelect = (animal) => {
    setSelectedAnimal(animal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue;
    switch (name) {
      case 'raza':
        newValue = opciones.razas.includes(value) ? value : '';
        break;
      case 'edad':
        newValue = value >= 0 && value <= 20 ? parseInt(value, 10) : 0;
        break;
      case 'ayuno':
        newValue = ['si', 'no'].includes(value.toLowerCase()) ? value.toLowerCase() : 'si';
        break;
      case 'enfermedad1':
        newValue = opciones.enfermedad1.includes(value) ? value : 'nada';
        if (newValue === 'nada') {
          setFormData({
            ...formData,
            ['enfermedad1']: 'nada',
            ['enfermedad2']: 'nada',
            ['enfermedad3']: 'nada',
            ['enfermedad4']: 'nada'

          });
          return;
        }
        break;
      case 'enfermedad2':
        newValue = opciones.enfermedad2.includes(value) ? value : 'nada';
        if (newValue === 'nada') {
          setFormData({
            ...formData,
            ['enfermedad2']: 'nada',
            ['enfermedad3']: 'nada',
            ['enfermedad4']: 'nada'

          });
          return;
        }
        break;
      case 'enfermedad3':
        newValue = opciones.enfermedad3.includes(value) ? value : 'nada';
        if (newValue === 'nada') {
          setFormData({
            ...formData,
            ['enfermedad3']: 'nada',
            ['enfermedad4']: 'nada'

          });
          return;
        }
        break;
      case 'enfermedad4':
        newValue = opciones.enfermedad4.includes(value) ? value : 'nada';
        if (newValue === 'nada') {
          setFormData({
            ...formData,
            ['enfermedad4']: 'nada'

          });
          return;
        }
        break;
      case 'tipoMuestra':
        newValue = opciones.tipoMuestra.includes(value) ? value : '';
        break;
      default:
        newValue = value;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => {
    setMostrarModal(false);
    recargarPagina();
  };

  const recargarPagina = () => {
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.raza &&
      formData.edad >= 0 &&
      formData.edad <= 20 &&
      ['si', 'no'].includes(formData.ayuno) &&
      opciones.enfermedad1.includes(formData.enfermedad1) &&
      opciones.enfermedad2.includes(formData.enfermedad2) &&
      opciones.enfermedad3.includes(formData.enfermedad3) &&
      opciones.enfermedad4.includes(formData.enfermedad4) &&
      opciones.tipoMuestra.includes(formData.tipoMuestra)
    ) {
      const nuevoDato = [
        selectedAnimal,
        formData.raza,
        formData.edad,
        formData.ayuno,
        formData.peso,
        formData.enfermedad1,
        formData.enfermedad2,
        formData.enfermedad3,
        formData.enfermedad4,
        formData.tipoMuestra,
      ];

      setDatosGuardados([...datosGuardados, nuevoDato]);

      setFormData({
        raza: '',
        edad: 0,
        ayuno: 'si',
        peso: '',
        enfermedad1: 'nada',
        enfermedad2: 'nada',
        enfermedad3: 'nada',
        enfermedad4: 'nada',
        tipoMuestra: '',
      });

      try {
        const response = await axios.post('http://localhost:5000/upla', {
          data: nuevoDato,
        });
        console.log('Respuesta del servidor:', response.data);
        setRespuesta(response.data);
        abrirModal();
      } catch (error) {
        console.error('Error al enviar datos al servidor:', error);
      }
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <div>
        <h1>Selecciona el paciente:</h1>
        <div>
          <img
            src="https://hips.hearstapps.com/hmg-prod/images/gettyimages-1422023439-64f1eaf518ace.jpg?crop=1xw:0.84375xh;center,top&resize=1200:*"
            alt="Perro"
            onClick={() => handleAnimalSelect('perro')}
          />
          <img
            src="https://www.santevet.es/uploads/images/es_ES/razas/gatocomuneuropeo.jpeg"
            alt="Gato"
            onClick={() => handleAnimalSelect('gato')}
          />
        </div>
      </div>
      {selectedAnimal && (
        <div className="form-container">
          <h2>Formulario para {selectedAnimal === 'perro' ? 'Perro' : 'Gato'}:</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <label>
                  Raza:
                  <select
                    name="raza"
                    value={formData.raza}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Selecciona una opción</option>
                    {opciones.razas && opciones.razas.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="col-md-4">
                <label>
                  Edad:
                  <input
                    type="number"
                    name="edad"
                    value={formData.edad}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </label>
              </div>
              <div className="col-md-4">
                <label>
                  Ayuno:
                  <select
                    name="ayuno"
                    value={formData.ayuno}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="si">Si</option>
                    <option value="no">No</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label>
                  Peso:
                  <input
                    type="text"
                    name="peso"
                    value={formData.peso}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </label>
              </div>
              <div className="col-md-4">
                <label>
                  Enfermedad 1:
                  <select
                    name="enfermedad1"
                    value={formData.enfermedad1}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="nada">Nada</option>
                    {opciones.enfermedad1 && opciones.enfermedad1.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {
                formData.enfermedad1 !== 'nada' &&
                (
                  <div className="col-md-4">
                    <label>
                      Enfermedad 2:
                      <select
                        name="enfermedad2"
                        value={formData.enfermedad2}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        <option value="nada">Nada</option>
                        {opciones.enfermedad2 && opciones.enfermedad2.map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )
              }
            </div>
            <div className="row">
              {formData.enfermedad2 !== 'nada' &&
                (<div className="col-md-4">
                  <label>
                    Enfermedad 3:
                    <select
                      name="enfermedad3"
                      value={formData.enfermedad3}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="nada">Nada</option>
                      {opciones.enfermedad3 && opciones.enfermedad3.map((opcion) => (
                        <option key={opcion} value={opcion}>
                          {opcion}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>)
              }
              {formData.enfermedad3 !== 'nada' &&
                (
                  <div className="col-md-4">
                    <label>
                      Enfermedad 4:
                      <select
                        name="enfermedad4"
                        value={formData.enfermedad4}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        <option value="nada">Nada</option>
                        {opciones.enfermedad4 && opciones.enfermedad4.map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )
              }
              <div className="col-md-4">
                <label>
                  Tipo de Muestra:
                  <select
                    name="tipoMuestra"
                    value={formData.tipoMuestra}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Selecciona una opción</option>
                    {opciones.tipoMuestra && opciones.tipoMuestra.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <br></br>
            <button type="submit" className="btn btn-primary">
              Ingresar
            </button>
          </form>
        </div>
      )}
      {datosGuardados.length > 0 && (
        <div>
          <h2>Datos Guardados:</h2>
          <ul>
            {datosGuardados.map((dato, index) => (
              <li key={index}>{JSON.stringify(dato)}</li>
            ))}
          </ul>
        </div>
      )}
      {respuesta && (
        <Modal show={mostrarModal} onHide={cerrarModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Instrucciones</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {respuesta.recipiente2 !== 'nada' && (
              <p>
                El recipiente indicado para guardar la muestra es {respuesta.recipiente1},
                en caso de no contar con él, puede utilizar {respuesta.recipiente2} o bien {respuesta.recipiente3}.
              </p>
            )}
            {respuesta.recipiente3 !== 'nada' && (
              <p>
                El recipiente indicado para guardar la muestra es {respuesta.recipiente1},
                en caso de no contar con él, puede utilizar {respuesta.recipiente2} o bien {respuesta.recipiente3}.
              </p>
            )}

            {respuesta.recipiente2 === 'nada' && respuesta.recipiente3 === 'nada' && (
              <p>
                El recipiente indicado para guardar la muestra es {respuesta.recipiente1}
              </p>
            )}
            {respuesta.cantidad && (
              <p>Se debe extraer {respuesta.cantidad} ml de muestra.</p>
            )}
            {respuesta.temperatura && (
              <p>Se debe almacenar a una temperatura de {respuesta.temperatura}°C.</p>
            )}
            {respuesta.tiempo && (
              <p>En la siguiente cantidad de tiempo: {respuesta.tiempo}hrs.</p>
            )}
            {respuesta.condiciones && (
              <p>En las siguientes condiciones: {respuesta.condiciones}</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default App;
