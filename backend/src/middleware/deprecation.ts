import { Request, Response, NextFunction } from 'express';

export const deprecateRoute = (sunsetDate: string, alternativeUrl?: string) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    // Standard IETF Deprecation headers
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', new Date(sunsetDate).toUTCString());
    
    if (alternativeUrl) {
      res.setHeader('Link', `<${alternativeUrl}>; rel="successor-version"`);
    }

    next();
  };
};
