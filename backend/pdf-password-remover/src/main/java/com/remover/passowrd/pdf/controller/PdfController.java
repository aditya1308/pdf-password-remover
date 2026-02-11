package com.remover.passowrd.pdf.controller;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "*") // change later to your frontend domain
public class PdfController {

    @PostMapping(value = "/unlock", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> unlockPdf(@RequestPart("file") MultipartFile file, @RequestPart("password") String password) {

        try (PDDocument document =
                     Loader.loadPDF(file.getBytes(), password)) {

            document.setAllSecurityToBeRemoved(true);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=unlocked.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(out.toByteArray());

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Invalid password or corrupted file".getBytes());
        }
    }


}
