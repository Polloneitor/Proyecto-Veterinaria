import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const opcionesRaza = ['p_largo', 'p_corto', 'mestizo'];
const opcionesEnfermedad1 = [
  'Diarrea', 'Ehrlichia_canis', 'Giardia', 'anemia', 'anemia_desconocida',
  'anemia_hemolitica', 'control_sano', 'distemper', 'enfermedad_renal',
  'hemoparasitos', 'leucemia', 'micoplasma', 'nada', 'parvovirus', 'sida',
  'sospecha_leucemia', 'sospecha_sida'
];
const opcionesEnfermedad2 = ['diarrea', 'falla_hepatica', 'leucemia', 'mucosa_palida', 'nada', 'parasitos'];
const opcionesEnfermedad3 = ['falla_renal', 'lombrices', 'nada', 'petequias'];
const opcionesEnfermedad4 = ['enfermedades_metabolicas', 'nada'];
const opcionesTipoMuestra = [
  'Coproparasitario', 'coproparasito_canino', 'hemograma', 'hemoparasito_gato',
  'hemoparasito_perro', 'perfil_bioquimico', 'sdma', 'urianalisis', 'virus'
];

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

  const handleAnimalSelect = (animal) => {
    setSelectedAnimal(animal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue;

    switch (name) {
      case 'raza':
        newValue = opcionesRaza.includes(value) ? value : '';
        break;
      case 'edad':
        newValue = value >= 0 && value <= 20 ? parseInt(value, 10) : 0;
        break;
      case 'ayuno':
        newValue = ['si', 'no'].includes(value.toLowerCase()) ? value.toLowerCase() : 'si';
        break;
      case 'peso':
        newValue = value >= 0.1 && value <= 20 ? parseFloat(value) : 0;
        break;
      case 'enfermedad1':
        newValue = opcionesEnfermedad1.includes(value) ? value : 'nada';
        break;
      case 'enfermedad2':
        newValue = opcionesEnfermedad2.includes(value) ? value : 'nada';
        break;
      case 'enfermedad3':
        newValue = opcionesEnfermedad3.includes(value) ? value : 'nada';
        break;
      case 'enfermedad4':
        newValue = opcionesEnfermedad4.includes(value) ? value : 'nada';
        break;
      case 'tipoMuestra':
        newValue = opcionesTipoMuestra.includes(value) ? value : '';
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
      formData.peso >= 0.1 &&
      formData.peso <= 20 &&
      opcionesEnfermedad1.includes(formData.enfermedad1) &&
      opcionesEnfermedad2.includes(formData.enfermedad2) &&
      opcionesEnfermedad3.includes(formData.enfermedad3) &&
      opcionesEnfermedad4.includes(formData.enfermedad4) &&
      opcionesTipoMuestra.includes(formData.tipoMuestra)
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
        const response = await axios.post('http://localhost:5000/upload', {
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
                    {opcionesRaza.map((opcion) => (
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
                    {opcionesEnfermedad1.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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
                    {opcionesEnfermedad2.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label>
                  Enfermedad 3:
                  <select
                    name="enfermedad3"
                    value={formData.enfermedad3}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="nada">Nada</option>
                    {opcionesEnfermedad3.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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
                    {opcionesEnfermedad4.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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
                    {opcionesTipoMuestra.map((opcion) => (
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
            <ul>
              <li>Recipiente 1: {respuesta.recipiente1}</li>
              
              <li>Recipiente 2: {respuesta.recipiente2}</li>
              <li>Recipiente 3: {respuesta.recipiente3}</li>
              <li>Cantidad: {respuesta.cantidad}</li>
              <li>Temperatura: {respuesta.temperatura}</li>
              <li>Tiempo: {respuesta.tiempo}</li>
              <li>Condiciones: {respuesta.condiciones}</li>
            </ul>
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
