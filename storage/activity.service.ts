import { AppError } from "@/utils/AppError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACTIVITIES_COLLECTION, ESPECIFIC_ACTIVITY_COLLECTION } from "./storageConfig";

class ActivityService {
    constructor() {

    }

    async getAllActivities() {
        try {
            const storage = await AsyncStorage.getItem(ACTIVITIES_COLLECTION)

            const groups: ActivityTypeDTO[] = storage ? JSON.parse(storage) : []

            return groups
        } catch (error) {
            throw error;
        }
    }

    async addActivity(activity: ActivityTypeDTO) {
        try {
            console.log(activity);
            const storedGroup = await this.getAllActivities();
            const groupAlreadyExists = storedGroup.some(item => item.id === activity.id);
            if (groupAlreadyExists) {
                throw new AppError("Atividade já cadastrada");
            }
            const storage = JSON.stringify([...storedGroup, activity]);
            await AsyncStorage.setItem(ACTIVITIES_COLLECTION, storage);

            //console.log("Atividade adicionada com sucesso!");

        } catch (error) {

        }
    }

    async getActivityById(id: string) {
        try {
            const storedGroup = await this.getAllActivities();
            const activity: ActivityTypeDTO | undefined = storedGroup.find(item => item.id === id);

            return activity;
        }
        catch (error) {
            throw error;
        }
    }
    async removeActivity(id: string) {
        try {
            const storedGroups = await this.getAllActivities();
            const filteredGroups = storedGroups.filter(item => item.id !== id);

            const storage = JSON.stringify(filteredGroups);
            await AsyncStorage.setItem(ACTIVITIES_COLLECTION, storage);
            await AsyncStorage.removeItem(`${ESPECIFIC_ACTIVITY_COLLECTION}-${id}`);
        } catch (error) {
            throw error;
        }
    }
}



export default ActivityService;
