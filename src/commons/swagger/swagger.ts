import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SwaggerService = (app: INestApplication) => {
  const document = new DocumentBuilder()
    .setTitle('Official Marketplace API Documentation')
    .setDescription(
      'The Marketplace API provides a comprehensive interface for accessing all system endpoints, ' +
        'managing authentication and authorization, and interacting with core data models. ' +
        'This documentation is intended for internal development teams, integration partners, and authorized clients, ' +
        'with detailed information on request/response structures, security schemes, error handling, and practical usage examples.',
    )
    .setTermsOfService('http://example.com/terms')
    .setContact('Developer', 'http://www.example.com/support', 'rndyfrdynsyh@gmail.com')
    .setVersion('1.0.0')
    .setLicense('Apache 2.0', 'https://www.apache.org/licenses/LICENSE-2.0.html')
    .addBearerAuth({
      type: 'http',
      description: 'Provide a valid JWT token. Example: Bearer eyJhbGciOiJIUzI1...',
    })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, document);

  swaggerDocument.tags = [
    {
      name: 'App',
      description:
        'Handles core application configuration, health checks, and system monitoring endpoints.',
    },
    {
      name: 'Auth',
      description:
        'Responsible for authentication, authorization, and secure session management across all services.',
    },
    {
      name: 'Carts',
      description:
        'Manages shopping cart operations, including item management, quantity updates, and cart persistence.',
    },
    {
      name: 'Categories',
      description:
        'Organizes and manages product categories, providing structured classification for catalog navigation.',
    },
    {
      name: 'Payments',
      description:
        'Handles payment configurations, methods, and processing integration with third-party providers.',
    },
    {
      name: 'Products',
      description:
        'Manages product data, pricing, availability, and related metadata within the system catalog.',
    },
    {
      name: 'Transactions',
      description:
        'Processes and tracks order transactions, payment statuses, and fulfillment activities.',
    },
    {
      name: 'Upload',
      description:
        'Provides secure endpoints for file upload, storage management, and media access handling.',
    },
    {
      name: 'User',
      description:
        'Handles user account management, profile details, and access control functionalities.',
    },
  ];

  return swaggerDocument;
};
