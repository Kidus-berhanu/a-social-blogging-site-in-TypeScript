class ApiService {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(email: string, password: string): Promise<string> {
    // Send a POST request to the login endpoint to get a token
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const { token } = await response.json();
    this.token = token;
    return token;
  }

  async getPosts(): Promise<Post[]> {
    // Send a GET request to the posts endpoint to get all posts
    const response = await fetch(`${this.baseUrl}/posts`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    const { posts } = await response.json();
    return posts;
  }

  async createPost(title: string, content: string): Promise<Post> {
    // Send a POST request to the posts endpoint to create a new post
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    const { post } = await response.json();
    return post;
  }

  async updatePost(id: number, title: string, content: string): Promise<Post> {
    // Send a PUT request to the posts endpoint to update a post
    const response = await fetch(`${this.baseUrl}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    const { post } = await response.json();
    return post;
  }

  async deletePost(id: number): Promise<void> {
    // Send a DELETE request to the posts endpoint to delete a post
    await fetch(`${this.baseUrl}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
