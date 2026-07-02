import router from 'express';
import foodRoutes from './food.routes';
import authRoutes from '../v2Routes/auth.routes';
import orderRoutes from '../v2Routes/order.routes';
import partnerProfileRoutes from '../v1Routes/partnerProfile.routes';
import userProfilesRoutes from '../v1Routes/userProfiles.routes';
import userActionRoutes from '../v1Routes/useraction.routes';


const v3Routes = router();

v3Routes.use('/foods', foodRoutes)
v3Routes.use('/auth',authRoutes)
v3Routes.use('/orders', orderRoutes)
v3Routes.use('/partners', partnerProfileRoutes);
v3Routes.use('/users', userProfilesRoutes);
v3Routes.use('/actions', userActionRoutes);

export default v3Routes;