import { useState }  from 'react';
import axios from 'axios';
import './upload.scss';

const UploadForm = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [validatedProducts, setValidatedProducts] = useState([]);
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleUpload = () => {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);
  
      axios.post('http://localhost:3001/upload', formData)
        .then((response) => {
          console.log(response.data);
          setValidatedProducts(response.data.products);
        })
        .catch((error) => {
          console.error(error);
          // Lide com erros de upload
        });
    };

    const handleUpdateAllPrices = () => {
        axios.post('http://localhost:3001/update', validatedProducts)
            .then((response) => {
                console.log(response.data);
                // Lide com a resposta do servidor
            })
            .catch((error) => {
                console.error(error);
                // Lide com erros de upload
            });
    };


    const arquivos = [
        {
            "product_code": "1",
            "name": "Produto 1",
            "current_price": "10.00",
            "new_price": "9.00"
        },
        {
            "product_code": "2",
            "name": "Produto 2",
            "current_price": "20.00",
            "new_price": "18.00"
        },
    ];
  
    return (
      <div>
        <div className='container__title'>
        <h1 >Teste Técnico Shopper</h1>
        <h2>Upload de Arquivo CSV</h2>
        </div>
      
      <div className='container'>
        <input className='container__input' type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Validar</button>     
  
        {arquivos.length > 0 && (
        <div>
          <h2>Produtos Validados</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Preço Atual</th>
                <th>Novo Preço</th>               
              </tr>
            </thead>
            <tbody>
              {arquivos.map((product) => (
                <tr key={product.product_code}>
                  <td>{product.product_code}</td>
                  <td>{product.name}</td>
                  <td>{product.current_price}</td>
                  <td>{product.new_price}</td>                  
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleUpdateAllPrices}>Atualizar Valores</button>
        </div>
      )}
        
      </div>
      </div>
    );
  }

export default UploadForm;
