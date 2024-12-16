import {baseURL, urls} from "../constants/urls";
import {axiosService} from "./AxiosService";

const SubtitleService = {

  async fetchSubtitles(fileId: string): Promise<any[]> {
    try {
      const response = await axiosService.get(`${baseURL}${urls.subtitles}/${fileId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching subtitles:", error);
      throw new Error("Failed to load subtitles.");
    }
  },

    async fetchSubtitlesForVideo(fileId: string): Promise<any[]> {
      try {
        const response = await axiosService.get(`${baseURL}${urls.subtitles}/video/${fileId}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching subtitles:", error);
        throw new Error("Failed to load subtitles.");
      }
    },

async processHighlightedText(data: { resourceName: string, highlightedText: string, context: string, language: string }) {
  try {
    const response = await axiosService.post(`${baseURL}${urls.dictionary}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error processing highlighted text');
  }
},

async getTranslation(data: { resourceName: string, highlightedText: string, context: string, language: string }): Promise<string> {
  try {
    const response = await axiosService.post(`${baseURL}${urls.dictionary}/translation`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error processing highlighted text');
  }
},

async fetchAllSubtitles(): Promise<any[]> {
  try {
      const response = await axiosService.get(`${baseURL}${urls.subtitles}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dictionary items:", error);
    throw new Error("Failed to load the dictionary.");
  }
},

async uploadSubtitles(formData: FormData) {
  try {
    const response = await axiosService.post(`${baseURL}${urls.uploadSubtitles}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },});
    return response.data;
  } catch (error) {
    throw new Error('Error processing highlighted text');
  }
},
  
  async deleteSubtitlesByName(name: string) {
    await axiosService.delete(`${baseURL}${urls.subtitles}/${name}`);
  },

};

export { SubtitleService };
