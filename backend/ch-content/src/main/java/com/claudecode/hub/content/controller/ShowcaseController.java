package com.claudecode.hub.content.controller;

import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.content.dto.ContentDtos.ShowcaseVO;
import com.claudecode.hub.content.service.ShowcaseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@Tag(name = "Cases")
public class ShowcaseController {
    private final ShowcaseService service;

    public ShowcaseController(ShowcaseService service) {
        this.service = service;
    }

    @GetMapping
    public R<PageResult<ShowcaseVO>> list(
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "12") long size) {
        return R.ok(service.list(sort, page, size));
    }

    @GetMapping("/top")
    public R<List<ShowcaseVO>> top(@RequestParam(defaultValue = "3") int limit) {
        return R.ok(service.top(limit));
    }
}
