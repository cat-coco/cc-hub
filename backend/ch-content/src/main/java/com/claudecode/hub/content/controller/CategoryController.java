package com.claudecode.hub.content.controller;

import com.claudecode.hub.common.api.R;
import com.claudecode.hub.content.dto.ContentDtos.CategoryVO;
import com.claudecode.hub.content.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categories")
public class CategoryController {
    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @GetMapping
    public R<List<CategoryVO>> list() {
        return R.ok(service.list());
    }
}
