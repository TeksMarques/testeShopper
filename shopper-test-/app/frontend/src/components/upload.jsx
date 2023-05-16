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

    const isError = validatedProducts.some((product) => !(product.error == '' || product.error == null));
  
    return (
      <div>
        <div className='container__title'>
        <h1 >Teste Técnico Shopper</h1>
        <h2>Upload de Arquivo CSV</h2>
        </div>
      
      <div className='container'>
        <input className='container__input' type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Validar</button>     
  
        {validatedProducts.length > 0 && (
        <div>
          <h2>Produtos Validados</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Preço Atual</th>
                <th>Novo Preço</th>  
                <th>Status</th>              
              </tr>
            </thead>
            <tbody>
              {validatedProducts.map((product) => (
                <tr key={product.product_code}>
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>{product.sales_price}</td>
                  <td>{product.new_price}</td> 
                  <td>{product.error}</td>                   
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleUpdateAllPrices} disabled={isError}>Atualizar Valores</button>
        </div>
      )}
        
      </div>
      </div>
    );
  }

export default UploadForm;
