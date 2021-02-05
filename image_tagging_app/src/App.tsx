import React from 'react';
import ImageCanvas from './components/ImageCanvas/ImageCanvas';
import ImageTaggingPage from './ImageTaggingPage';

function App() {
  /*<ImageTaggingPage />*/
  return (
    <div className="container">
      <div className="row">
        <div className="col-10">
          <ImageCanvas />
        </div>
      </div>

    </div>

  );
}

export default App;
