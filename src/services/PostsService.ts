import axios from "axios";

export class PostsService {
  async getDocumentsByUser(userId: number | null) {
    console.log(userId);
    let response = await axios.post(
      "http://localhost:3005/posts/all",
      { userId: userId },

      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }
  async getDocumentsByIdAndTitle(userId: number | null, id: number) {
    console.log(userId);
    let response = await axios.post(
      "http://localhost:3005/posts/findpost",
      { userId: userId, id: id },

      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }

  async changeDocument(
    userId: number | null,
    id: number,
    title: string,
    message: string
  ) {
    console.log(message);
    let response = await axios.post(
      "http://localhost:3005/posts/change/",
      { userId: userId, id: id, title: title, message: message },

      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }

  async newDocument(userId: number | null, title: string, message: string) {
    console.log(message);
    let response = await axios.post(
      "http://localhost:3005/posts/new/",
      { userId: userId, title: title, message: message },

      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }

  async removeDocument(id: string) {
    let response = await axios.post(
      "http://localhost:3005/posts/remove/",
      { id: id },

      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }
}
