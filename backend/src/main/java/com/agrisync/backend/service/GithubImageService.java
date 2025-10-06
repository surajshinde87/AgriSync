package com.agrisync.backend.service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GithubImageService {

    @Value("${github.owner}")
    private String owner;

    @Value("${github.repo}")
    private String repo;

    @Value("${github.token}")
    private String token;

    @Value("${github.base-path}")
    private String basePath;

    @Value("${github.default-branch}")
    private String branch;

    private final RestTemplate restTemplate = new RestTemplate();
    public String uploadImage(MultipartFile file, String fileName) {
    try {
        String base64Content = Base64.getEncoder().encodeToString(file.getBytes());
        String path = basePath + "/" + fileName;

        String url = String.format("https://api.github.com/repos/%s/%s/contents/%s", owner, repo, path);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "token " + token);
        headers.set("Accept", "application/vnd.github+json");

        //  Step 1: Try to get file SHA (if file exists)
        String fileSha = null;
        try {
            ResponseEntity<Map> existingFileResponse = restTemplate.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
            );
            if (existingFileResponse.getStatusCode().is2xxSuccessful()) {
                fileSha = (String) existingFileResponse.getBody().get("sha");
                System.out.println("Existing file SHA: " + fileSha);
            }
        } catch (Exception e) {
            System.out.println("File does not exist yet. Creating new one...");
        }

        //  Step 2: Prepare body
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Upload or update image " + fileName);
        body.put("content", base64Content);
        body.put("branch", branch);
        if (fileSha != null) {
            body.put("sha", fileSha); // Required for updates
        }

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        //  Step 3: Upload or update using PUT
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.PUT, requestEntity, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return String.format(
                "https://raw.githubusercontent.com/%s/%s/%s/%s",
                owner, repo, branch, path
            );
        } else {
            throw new RuntimeException("GitHub upload failed: " + response.getStatusCode());
        }

    } catch (IOException e) {
        throw new RuntimeException("Error uploading file to GitHub", e);
    }
}


}