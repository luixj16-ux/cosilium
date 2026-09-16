export class InvalidCredentialsError extends Error {
  constructor(message = 'Usuario o contraseña incorrectos.') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'No autenticado: debes iniciar sesión para acceder a este recurso.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'No tienes permisos para realizar esta acción.') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Recurso no encontrado.') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class AlreadyExistsError extends Error {
  constructor(message = 'El recurso ya existe.') {
    super(message);
    this.name = 'AlreadyExistsError';
  }
}