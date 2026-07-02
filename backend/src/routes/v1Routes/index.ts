import router from 'express';
import userProfilesRoutes from './userProfiles.routes';
import foodRoutes from './food.routes';
import partnerProfileRoutes from './partnerProfile.routes';
import userActionRoutes from './useraction.routes';
import authRoutes from './auth.routes';


const v1Routes = router();


v1Routes.use('/users', userProfilesRoutes);
v1Routes.use('/foods', foodRoutes);
v1Routes.use('/actions', userActionRoutes);
v1Routes.use('/auth', authRoutes)
v1Routes.use('/partners', partnerProfileRoutes);

export default v1Routes;