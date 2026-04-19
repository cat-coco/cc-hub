package com.claudecode.hub.content.controller;

import com.claudecode.hub.common.api.R;
import com.claudecode.hub.content.dto.ContentDtos.TagVO;
import com.claudecode.hub.content.service.TagService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@Tag(name = "Tags")
public class TagController {
    private final TagService service;

    public TagController(TagService service) {
        this.service = service;
    }

    @GetMapping
    public R<List<TagVO>> all() {
        return R.ok(service.all());
    }

    @GetMapping("/top")
    public R<List<TagVO>> top(@RequestParam(defaultValue = "12") int limit) {
        return R.ok(service.top(limit));
    }
}
