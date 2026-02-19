import { BASE_URL } from "./api";

export const getProjectStatus = async (token) => {
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

export const getAllProject = async (token) => {
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
