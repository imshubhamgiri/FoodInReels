import { createContext, useContext , useState, useEffect } from "react";
import { userAPI, partnerAPI, authAPI, profileAPI } from "../services/api";


const AppContext = createContext();


export const AppProvider = ({ children }) => {

    const [user , setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [isAddressesLoaded, setIsAddressesLoaded] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
    const [isAuthenticated , setIsAuthenticated] = useState(false);
    const [isUserfetched , setIsUserFetched] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true); // Added loading state for auth check
    const [Food , setFood] = useState([]);
    const [Cart , setCart] = useState([]);
    const [Orders , setOrders] = useState([]);
    const [Restaurants , setRestaurants] = useState([]);
    const [showLoginModal, setShowLoginModal] = useState(false);


    const login = async (userData) => {
        const response = await userAPI.login(userData);
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
    }

    const register = async (userData) => {
        const response = await userAPI.register(userData);
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
    }

    const logout = async () => {
        try {
            await userAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setUserProfile(null);
            setIsProfileLoaded(false);
            setAddresses([]);
            setIsAddressesLoaded(false);
            setIsAuthenticated(false);
        }
    }

    const partnerRegister = async (partnerData) => {
        const response = await partnerAPI.register(partnerData);
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
    }

    const partnerLogin = async (partnerData) => {
        const response = await partnerAPI.login(partnerData);
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
    }

    const partnerLogout = async () => {
        try {
            await partnerAPI.logout();
        } catch (error) {
            console.error('Partner logout error:', error);
        } finally {
            setUser(null);
            setUserProfile(null);
            setIsProfileLoaded(false);
            setAddresses([]);
            setIsAddressesLoaded(false);
            setIsAuthenticated(false);
        }
    }

    const fetchUserProfile = async (force = false) => {
        if (!force && isProfileLoaded && userProfile) {
            return userProfile;
        }
        setIsLoadingProfile(true);
        try {
            const response = await profileAPI.getMe();
            const data = response?.data || response;
            setUserProfile(data);
            setIsProfileLoaded(true);
            if (data && user) {
                setUser((prev) => ({ ...prev, ...data }));
            }
            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const fetchAddresses = async (force = false) => {
        if (!force && isAddressesLoaded && addresses.length > 0) {
            return addresses;
        }
        setIsLoadingAddresses(true);
        try {
            const response = await profileAPI.getAddress();
            const list = response?.data || [];
            setAddresses(list);
            setIsAddressesLoaded(true);
            return list;
        } catch (error) {
            console.error('Error fetching user addresses:', error);
            return [];
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const addAddress = async (newAddress) => {
        const response = await profileAPI.addAddress(newAddress);
        const saved = response?.data || response;
        setAddresses((prev) => [...prev, saved]);
        return saved;
    };

    const updateAddress = async (id, updatedData) => {
        const response = await profileAPI.updateAddress(id, updatedData);
        const updated = response?.data || response;
        setAddresses((prev) => prev.map((addr) => (addr._id === id ? updated : addr)));
        return updated;
    };

    const deleteAddress = async (addressId) => {
        await profileAPI.deleteAddress(addressId);
        setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
    };

    const fetchUserData = async () => {
        try {
          const response = await authAPI.checkAuth();
            if (response.userType === 'user') {
                setUser(response);
                setIsAuthenticated(true);
                setIsUserFetched(true);
            }
            else if(response.userType === 'partner'){
                setUser(response);
                setIsAuthenticated(true);
                setIsUserFetched(true);
            }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setUserProfile(null);
          setIsProfileLoaded(false);
          setAddresses([]);
          setIsAddressesLoaded(false);
          setIsAuthenticated(false);
        } finally {
            setIsAuthLoading(false); // Auth check is complete
        }
    };

    // Automatically check auth status when whole app loads
    useEffect(() => {
        fetchUserData();
    }, []);

    const value = {
            user,
            setUser,
            userProfile,
            setUserProfile,
            isProfileLoaded,
            isLoadingProfile,
            fetchUserProfile,
            addresses,
            setAddresses,
            isAddressesLoaded,
            isLoadingAddresses,
            fetchAddresses,
            addAddress,
            updateAddress,
            deleteAddress,
            isAuthenticated,
            setIsAuthenticated,
            Food,
            Cart,
            Orders,
            Restaurants,
            login,
            register,
            logout,
            partnerRegister,
            partnerLogin,
            partnerLogout,
            fetchUserData,
            isUserfetched,
            isAuthLoading, // Exported for protected routes
            showLoginModal,
            setShowLoginModal,
    }    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};   

export const useAppContext = () => { return useContext(AppContext); };