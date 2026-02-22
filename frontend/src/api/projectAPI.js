import { BASE_URL } from "./api";

export const getCurrentUserAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/api/current-user/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch gender data");
  }

  return await response.json();
};

export const getAllUserAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/api/user-list/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const getProjectStatusAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/api/project-status/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const postProjectAPI = async (formData, token) => {
  const response = await fetch(`${BASE_URL}/api/project-create/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const getAllProjectAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/api/project-list/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const getProjectDataAPI = async (token, id) => {
  const response = await fetch(`${BASE_URL}/api/project-edit/${id}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const editProjectDataAPI = async (token, formData, id) => {
  const response = await fetch(`${BASE_URL}/api/project-edit/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const getTaskStatusAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/api/task-status-priority/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const postTaskAPI = async (formData, token) => {
  const response = await fetch(`${BASE_URL}/api/task-create/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const getTaskDataAPI = async (token, id) => {
  const response = await fetch(`${BASE_URL}/api/project-detail/${id}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const editTaskDataAPI = async (token, formData, id) => {
  const response = await fetch(`${BASE_URL}/api/task-edit/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};
