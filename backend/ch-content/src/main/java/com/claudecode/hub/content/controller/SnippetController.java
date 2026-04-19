package com.claudecode.hub.content.controller;

import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.content.dto.ContentDtos.SnippetVO;
import com.claudecode.hub.content.service.SnippetService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/snippets")
@Tag(name = "Snippets")
public class SnippetController {
    private final SnippetService service;

    public SnippetController(SnippetService service) {
        this.service = service;
    }

    @GetMapping
    public R<PageResult<SnippetVO>> list(
            @RequestParam(required = false) String language,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "12") long size) {
        return R.ok(service.list(language, sort, page, size));
    }

    @GetMapping("/{id}")
    public R<SnippetVO> detail(@PathVariable long id) {
        return R.ok(service.findById(id));
    }

    @PostMapping("/{id}/copy")
    public R<Void> copied(@PathVariable long id) {
        service.incrCopy(id);
        return R.ok();
    }
}
