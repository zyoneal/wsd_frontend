import {baseURL, urls} from "../constants/urls";
import {axiosService} from './AxiosService';

const DictionaryService = {
  async fetchDictionaryItems(): Promise<any[]> {
    try {
      const response = await axiosService.get(`${baseURL}${urls.dictionary}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching dictionary items:", error);
      throw new Error("Failed to load the dictionary");
    }
  },

  async fetchDictionaryResources(): Promise<any[]> {
    try {
      const response = await axiosService.get(`${baseURL}${urls.dictionaryResources}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching dictionary items:", error);
      throw new Error("Failed to load the dictionary");
    }
  },

  async fetchDictionaryItemsByResourceName(name: string): Promise<any[]> {
    try {
      const response = await axiosService.get(`${baseURL}${urls.dictionaryResources}/${name}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching dictionary items by resource name:", error);
      throw new Error("Failed to load the dictionary for the selected resource.");
   }
  },

  async deleteDictionaryResource(groupName: string) {
      await axiosService.delete(`${baseURL}${urls.dictionaryResources}/${groupName}`);
  },

  async deleteDictionaryItem(itemId: number) {
      await axiosService.delete(`${baseURL}${urls.dictionary}/${itemId}`);
  },
  
  async exportDictionaryByResourceAsCSV(resourceName: string): Promise<Blob> {
    try {
      const response = await axiosService.get(
          `${baseURL}${urls.dictionaryResources}/${resourceName}/export/csv`,
          {
            responseType: "blob",
          }
      );
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch the CSV file. Response is empty.");
      }
    } catch (error) {
      throw new Error(`Failed to export dictionary as CSV: ${error}`);
    }
  },
  
  async exportAllDictionaryAsCSV(): Promise<Blob> {
    try {
      const response = await axiosService.get(
          `${baseURL}${urls.dictionary}/export/csv`,
          {
            responseType: "blob",
          }
      );
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("Failed to fetch the CSV file. Response is empty.");
      }
    } catch (error) {
      throw new Error(`Failed to export dictionary as CSV: ${error}`);
    }
  }

};

export { DictionaryService };
