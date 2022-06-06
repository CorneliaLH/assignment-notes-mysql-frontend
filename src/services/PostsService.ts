import axios from "axios";

export class PostsService {
  async getDocumentsByUser(userId: number | null) {
    console.log(userId);
    let response = await axios.post<any>(
      "http://localhost:3005/posts/post/:id",
      { userId: userId },

      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }
  async getDocumentsByIdAndTitle(userId: number | null, id: number) {
    console.log(userId);
    let response = await axios.post<any>(
      "http://localhost:3005/posts/poster/:titleandid",
      { userId: userId, id: id },

      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }

  async changeDocument(userId: number | null, id: number, message: string) {
    console.log(message);
    let response = await axios.post<any>(
      "http://localhost:3005/posts/change/:titleandid",
      { userId: userId, id: id, message: message },

      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }
}
