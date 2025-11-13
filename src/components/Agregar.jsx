import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { addTaskSlice } from "../redux/features/taskSlice";
import { addTaskService } from "../services/taskServices";

const Agregar = ({ projectId }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setShow(false);
    setTitle("");
    setDescription("");
    setError("");
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("El título no puede estar vacío");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const created = await addTaskService({ title, description, projectId });
      const createdTask = created.tarea || created.payload || created.data || created;
      dispatch(addTaskSlice(createdTask));


      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err) {
      console.error("Error creando tarea:", err);
      setError("Error al crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        + Agregar Tarea
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar nueva tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Tarea agregada correctamente</Alert>}

          <Form>
            <Form.Group className="mb-3" controlId="taskTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="taskDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descripción (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Agregar;
