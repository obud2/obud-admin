import React, { useEffect, useState } from 'react';

const SwaggerUI = React.lazy(() => import('swagger-ui-react'));

import 'swagger-ui-react/swagger-ui.css';

const Swagger = () => {
  const [url, setUrl] = useState();

  useEffect(() => {
    setUrl('https://s3.ap-northeast-2.amazonaws.com/file.obud.site/api.json');
  }, []);

  return <SwaggerUI url={url} />;
};

export default Swagger;
