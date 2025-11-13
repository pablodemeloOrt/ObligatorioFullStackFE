import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Spinner } from "react-bootstrap";
import { uploadImageService } from "../services/imageService";
import "../styles/estilos.css";

const SubirImagenComponent = ({ 
  onImageUploaded, 
  buttonText = "Seleccionar imagen",
  maxSizeMB = 5,
  previewSize = 150 
}) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Comprimir y redimensionar imagen antes de convertir a Base64
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionar si es muy grande
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a base64 con compresión JPEG
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        
        img.onerror = () => reject(new Error("Error al procesar la imagen"));
      };
      
      reader.onerror = () => reject(new Error("Error al leer el archivo"));
    });
  };

  // Manejar selección de archivo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");

    // Validar tamaño
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`La imagen es demasiado grande. Máximo ${maxSizeMB}MB.`);
      return;
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Formato no permitido. Solo JPG, PNG, GIF o WEBP.");
      return;
    }

    try {
      // Comprimir imagen antes de subir (reduce tamaño significativamente)
      const compressedBase64 = await compressImage(file, 800, 0.7);
      setPreview(compressedBase64);

      // Subir automáticamente al backend
      setUploading(true);
      const result = await uploadImageService(compressedBase64);
      
      // Notificar al componente padre con la URL segura
      if (onImageUploaded) {
        onImageUploaded(result.secure_url);
      }
    } catch (err) {
      console.error("Error al procesar/subir imagen:", err);
      setError("Error al subir la imagen. Intenta de nuevo.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  // Limpiar imagen seleccionada
  const handleClearImage = () => {
    setPreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageUploaded) {
      onImageUploaded(null);
    }
  };

  return (
    <div className="subir-imagen-container">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: "none" }}
      />
      
      <Button
        variant="outline-secondary"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mb-2"
      >
        📤 {preview ? "Cambiar imagen" : buttonText}
      </Button>

      {uploading && (
        <div className="mt-2">
          <Spinner animation="border" size="sm" /> Subiendo imagen...
        </div>
      )}

      {error && (
        <div className="text-danger mt-2" style={{ fontSize: "0.9em" }}>
          {error}
        </div>
      )}

      {preview && !uploading && (
        <div className="image-preview-container mt-3">
          <img
            src={preview}
            alt="Preview"
            className="image-preview"
            style={{
              width: `${previewSize}px`,
              height: `${previewSize}px`,
            }}
          />
          <button
            type="button"
            className="image-remove-btn btn btn-danger btn-sm"
            onClick={handleClearImage}
            title="Eliminar imagen"
          >
            ×
          </button>
        </div>
      )}

      <div className="text-muted mt-2" style={{ fontSize: "0.85em" }}>
        Formatos: JPG, PNG, GIF, WEBP. Máximo {maxSizeMB}MB. <br/>
        <small>La imagen será optimizada automáticamente para reducir el tamaño.</small>
      </div>
    </div>
  );
};

SubirImagenComponent.propTypes = {
  onImageUploaded: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  maxSizeMB: PropTypes.number,
  previewSize: PropTypes.number,
};

export default SubirImagenComponent;
