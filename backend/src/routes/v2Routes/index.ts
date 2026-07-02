import router from 'express';
import foodRoutes from './food.routes';
import authRoutes from './auth.routes';
import orderRoutes from './order.routes';
import { deprecateRoute } from '../../middleware/deprecation';
import partnerProfileRoutes from '../v1Routes/partnerProfile.routes';
import  userProfilesRoutes from '../v1Routes/userProfiles.routes';
import userActionRoutes from '../v1Routes/useraction.routes';


const v2Routes = router();

v2Routes.use('/foods', foodRoutes)
v2Routes.use('/auth',authRoutes)
v2Routes.use('/orders', orderRoutes)
v2Routes.use('/partners', partnerProfileRoutes);
v2Routes.use('/users', userProfilesRoutes);
v2Routes.use('/actions', userActionRoutes);

export default v2Routes;