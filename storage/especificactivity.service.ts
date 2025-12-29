import { AppError } from "@/utils/AppError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ESPECIFIC_ACTIVITY_COLLECTION } from "./storageConfig";

class EspecificActivityService {
    constructor() {
    }

    async getAllEspecificActivities() {

        return [];
    }
    async getEspecificActivityById(id: string) {
        try {
            const storage = await AsyncStorage.getItem(`${ESPECIFIC_ACTIVITY_COLLECTION}-${id}`)

            const storageSave: EspecificActivityTypeDTO[] = storage ? JSON.parse(storage) : [];


            return storageSave;
        } catch (error) {
            throw error;
        }
    }

    async getEspecificActivityByName(name: string) {
        try {
            const storage = await AsyncStorage.getItem(`${ESPECIFIC_ACTIVITY_COLLECTION}-${name}`)
            if (storage) {
                const especificActivity: EspecificActivityTypeDTO[] = JSON.parse(storage);
                return especificActivity;
            }
        } catch (error) {

        }
    }

    async getActivityByType(id: string, type: 'receitas' | 'despesas') {
        try {
            const storage = await AsyncStorage.getItem(`${ESPECIFIC_ACTIVITY_COLLECTION}-${id}`)
            if (storage) {
                const especificActivity: EspecificActivityTypeDTO[] = JSON.parse(storage);
                return especificActivity.filter(activity => activity.type === type);
            }
            return [];
        } catch (error) {
            return [];
        }
    }

    async addEspecificActivity(especificActivity: EspecificActivityTypeDTO) {
        try {
            const storedEspecificActivity = await this.getEspecificActivityById(especificActivity.idActivity);

            const groupAlreadyExists = storedEspecificActivity.some(item => item.id === especificActivity.id);
            const groupAlreadyExistsName = storedEspecificActivity.some(item => item.name === especificActivity.name);

            if (groupAlreadyExists || groupAlreadyExistsName) {
                throw new AppError("Atividade já cadastrada");
            }
            
            const storage = JSON.stringify([...storedEspecificActivity, especificActivity]);
            await AsyncStorage.setItem(`${ESPECIFIC_ACTIVITY_COLLECTION}-${especificActivity.idActivity}`, storage);
        } catch (error) {

        }
    }

    async removeEspecificActivity(idActivity: string, id: string) {
        try {
            const storedEspecificActivity = await this.getEspecificActivityById(idActivity);
            const filteredActivities = storedEspecificActivity.filter(activity => activity.id !== id);
            const storage = JSON.stringify(filteredActivities);
            await AsyncStorage.setItem(`${ESPECIFIC_ACTIVITY_COLLECTION}-${idActivity}`, storage);
        } catch (error) {
            throw error;
        }
    }
}

export default EspecificActivityService;