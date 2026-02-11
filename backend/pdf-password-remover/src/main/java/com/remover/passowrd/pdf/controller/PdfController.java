package com.remover.passowrd.pdf.controller;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "*")
public class PdfController {

    private static final Logger log = LoggerFactory.getLogger(PdfController.class);

    @PostMapping(value = "/unlock", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<byte[]> unlockPdf(@RequestPart("file") MultipartFile file, @RequestPart("password") String password) {

        log.info("Password : {}", password);
        try (PDDocument document = Loader.loadPDF(file.getBytes(), password)) {

            document.setAllSecurityToBeRemoved(true);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);

            log.info("PDF unlocked successfully");
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
