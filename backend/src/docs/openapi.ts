const apiBase = '/api/v3';

const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'FoodInReels API',
    version: '1.0.0',
    description:
      'Interactive API documentation for the FoodInReels backend. The recommended routes are versioned under /api/v3, while a few legacy aliases still exist for backward compatibility.',
  },
  servers: [
    {
      url: '/',
      description: 'Current server origin',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication, login, logout, refresh, and session inspection' },
    { name: 'Foods', description: 'Food feed, food detail, and partner food management' },
    { name: 'Orders', description: 'Create orders and inspect the current user order history' },
    { name: 'Partners', description: 'Partner profile endpoints' },
    { name: 'Profile', description: 'User profile and address management' },
    { name: 'Actions', description: 'Like and save food actions' },
    { name: 'Health', description: 'Service health check' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'Primary auth cookie used by protected routes. The backend also accepts the legacy token cookie or a Bearer token.',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiMessage: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Success' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          error: {
            oneOf: [
              { type: 'string' },
              {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            ],
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', example: 'Password123' },
        },
      },
      UserRegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', example: 'Password123' },
        },
      },
      PartnerRegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password', 'restaurantName', 'phone', 'address'],
        properties: {
          name: { type: 'string', example: 'Jane Partner' },
          email: { type: 'string', format: 'email', example: 'partner@example.com' },
          password: { type: 'string', example: 'Password123' },
          restaurantName: { type: 'string', example: 'Noodle House' },
          phone: { type: 'string', example: '9876543210' },
          address: { type: 'string', example: '12 Market Road, Bengaluru' },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string', example: 'optional-refresh-token' },
        },
      },
      FoodRequest: {
        type: 'object',
        required: ['name', 'description', 'price', 'type'],
        properties: {
          name: { type: 'string', example: 'Paneer Tikka' },
          description: { type: 'string', example: 'Smoky grilled paneer with spices' },
          price: { type: 'number', example: 249 },
          type: { type: 'string', enum: ['standard', 'reel'], example: 'reel' },
        },
      },
      UpdateFoodRequest: {
        allOf: [
          { $ref: '#/components/schemas/FoodRequest' },
          {
            type: 'object',
            required: ['foodId'],
            properties: {
              foodId: { type: 'string', example: '66ad9f2f8f3a4f2d91c1e111' },
            },
          },
        ],
      },
      FoodActionRequest: {
        type: 'object',
        required: ['foodId'],
        properties: {
          foodId: { type: 'string', example: '66ad9f2f8f3a4f2d91c1e111' },
        },
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['foodPartner', 'deliveryAddressSnapshot', 'items'],
        properties: {
          foodPartner: { type: 'string', example: '66ad9f2f8f3a4f2d91c1e222' },
          userAddressId: { type: 'string', example: '66ad9f2f8f3a4f2d91c1e333' },
          deliveryAddressSnapshot: {
            type: 'object',
            properties: {
              label: { type: 'string', enum: ['Home', 'Work', 'Other'], example: 'Home' },
              fullName: { type: 'string', example: 'John Doe' },
              phone: { type: 'string', example: '9876543210' },
              locality: { type: 'string', example: 'Koramangala' },
              address: { type: 'string', example: '12 Market Road' },
              city: { type: 'string', example: 'Bengaluru' },
              state: { type: 'string', example: 'Karnataka' },
              postalCode: { type: 'string', example: '560001' },
              country: { type: 'string', example: 'India' },
              landmark: { type: 'string', example: 'Near Metro Station' },
              alternatePhone: { type: 'string', example: '9123456780' },
            },
          },
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              properties: {
                food: { type: 'string', example: '66ad9f2f8f3a4f2d91c1e111' },
                nameSnapshot: { type: 'string', example: 'Paneer Tikka' },
                quantity: { type: 'integer', example: 2 },
                priceSnapshot: { type: 'number', example: 249 },
              },
            },
          },
        },
      },
      AddressRequest: {
        type: 'object',
        required: ['fullName', 'phone', 'postalCode', 'locality', 'address', 'city', 'state'],
        properties: {
          fullName: { type: 'string', example: 'John Doe' },
          phone: { type: 'string', example: '9876543210' },
          postalCode: { type: 'string', example: '560001' },
          locality: { type: 'string', example: 'Koramangala' },
          address: { type: 'string', example: '12 Market Road' },
          city: { type: 'string', example: 'Bengaluru' },
          state: { type: 'string', example: 'Karnataka' },
          country: { type: 'string', example: 'India' },
          landmark: { type: 'string', example: 'Near Metro Station' },
          alternatePhone: { type: 'string', example: '9123456780' },
          label: { type: 'string', enum: ['home', 'work', 'other'], example: 'home' },
          isDefault: { type: 'boolean', example: true },
        },
      },
      UpdateAddressRequest: {
        type: 'object',
        properties: {
          fullName: { type: 'string', example: 'John Doe' },
          phone: { type: 'string', example: '9876543210' },
          postalCode: { type: 'string', example: '560001' },
          locality: { type: 'string', example: 'Koramangala' },
          address: { type: 'string', example: '12 Market Road' },
          city: { type: 'string', example: 'Bengaluru' },
          state: { type: 'string', example: 'Karnataka' },
          country: { type: 'string', example: 'India' },
          landmark: { type: 'string', example: 'Near Metro Station' },
          alternatePhone: { type: 'string', example: '9123456780' },
          label: { type: 'string', enum: ['home', 'work', 'other'], example: 'home' },
          isDefault: { type: 'boolean', example: false },
        },
      },
      UserProfileUpdateRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          phone: { type: 'string', example: '9876543210' },
          gender: { type: 'string', example: 'male' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Healthy or degraded status payload',
          },
        },
      },
    },
    '/api/v3/auth/users/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserRegisterRequest' },
            },
          },
        },
        responses: {
          201: { description: 'User created' },
          400: { description: 'Validation failed' },
        },
      },
    },
    '/api/v3/auth/users/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Login success' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/v3/auth/users/logout': {
      post: {
        tags: ['Auth'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Logout a user',
        responses: {
          200: { description: 'Logout success' },
          401: { description: 'Authentication required' },
        },
      },
    },
    '/api/v3/auth/partners/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a food partner',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PartnerRegisterRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Partner created' },
          400: { description: 'Validation failed' },
        },
      },
    },
    '/api/v3/auth/partners/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login a food partner',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Login success' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/v3/auth/partners/logout': {
      post: {
        tags: ['Auth'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Logout a food partner',
        responses: {
          200: { description: 'Logout success' },
          401: { description: 'Authentication required' },
        },
      },
    },
    '/api/v3/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh the access token',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Token refreshed' },
        },
      },
    },
    '/api/v3/auth/me': {
      get: {
        tags: ['Auth'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Inspect the current authenticated user',
        responses: {
          200: { description: 'Current auth context' },
          401: { description: 'Authentication required' },
        },
      },
    },
    '/api/v3/foods': {
      get: {
        tags: ['Foods'],
        summary: 'List foods',
        security: [{ cookieAuth: [], bearerAuth: [] }],
        responses: {
          200: { description: 'Food list' },
        },
      },
      post: {
        tags: ['Foods'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Create a food item with background media upload',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['media', 'name', 'description', 'price', 'type'],
                properties: {
                  media: { type: 'string', format: 'binary' },
                  name: { type: 'string', example: 'Paneer Tikka' },
                  description: { type: 'string', example: 'Smoky grilled paneer with spices' },
                  price: { type: 'number', example: 249 },
                  type: { type: 'string', enum: ['standard', 'reel'], example: 'reel' },
                },
              },
            },
          },
        },
        responses: {
          202: { description: 'Upload accepted for background processing' },
          400: { description: 'Validation failed' },
        },
      },
    },
    '/api/v3/foods/partners/{id}': {
      get: {
        tags: ['Foods'],
        summary: 'Get a food item by partner or food identifier',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Food item payload' },
        },
      },
    },
    '/api/v3/foods/{foodId}': {
      patch: {
        tags: ['Foods'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Update a food item',
        parameters: [
          {
            name: 'foodId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FoodRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Food updated' },
        },
      },
      delete: {
        tags: ['Foods'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Delete a food item',
        parameters: [
          {
            name: 'foodId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Food deleted' },
        },
      },
    },
    '/api/v3/partners/foodPartners': {
      get: {
        tags: ['Partners'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Get the current partner profile',
        responses: {
          200: { description: 'Partner profile' },
          401: { description: 'Authentication required' },
          403: { description: 'Partner role required' },
        },
      },
    },
    '/api/v3/partners/foodPartners/{id}': {
      get: {
        tags: ['Partners'],
        summary: 'Get a public partner profile',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Public partner profile' },
        },
      },
    },
    '/api/v3/users/me': {
      get: {
        tags: ['Profile'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Get the current user profile',
        responses: {
          200: { description: 'User profile' },
          401: { description: 'Authentication required' },
        },
      },
      patch: {
        tags: ['Profile'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Update the current user profile',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserProfileUpdateRequest' },
            },
          },
        },
        responses: {
          200: { description: 'User profile updated' },
        },
      },
    },
    '/api/v3/users/me/saved-foods': {
      get: {
        tags: ['Profile'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'List saved foods for the current user',
        responses: {
          200: { description: 'Saved foods' },
        },
      },
    },
    '/api/v3/users/me/addresses': {
      get: {
        tags: ['Profile'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'List user addresses',
        responses: {
          200: { description: 'Address list' },
        },
      },
      post: {
        tags: ['Profile'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Add a user address',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddressRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Address created' },
        },
      },
    },
    '/api/v3/users/me/addresses/{addressId}': {
      patch: {
        tags: ['Profile'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Update a user address',
        parameters: [
          {
            name: 'addressId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateAddressRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Address updated' },
        },
      },
      delete: {
        tags: ['Profile'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Delete a user address',
        parameters: [
          {
            name: 'addressId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Address deleted' },
        },
      },
    },
    '/api/v3/users/me/addresses/{addressId}/default': {
      patch: {
        tags: ['Profile'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Mark an address as default',
        parameters: [
          {
            name: 'addressId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Default address updated' },
        },
      },
    },
    '/api/v3/actions/like': {
      post: {
        tags: ['Actions'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Like a food item',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FoodActionRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Like toggled' },
        },
      },
    },
    '/api/v3/actions/save': {
      post: {
        tags: ['Actions'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Save a food item',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FoodActionRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Save toggled' },
        },
      },
    },
    '/api/v3/orders': {
      post: {
        tags: ['Orders'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'Create an order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Order created' },
        },
      },
    },
    '/api/v3/orders/my-orders': {
      get: {
        tags: ['Orders'],
        security: [{ cookieAuth: [], bearerAuth: [] }],
        summary: 'List the current user orders',
        responses: {
          200: { description: 'Order list' },
        },
      },
    },
  },
} as const;

export default openApiDocument;
export { apiBase };