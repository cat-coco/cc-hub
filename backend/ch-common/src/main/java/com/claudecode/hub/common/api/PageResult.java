package com.claudecode.hub.common.api;

import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;

public record PageResult<T>(List<T> items, long total, long page, long size) {
    public static <T> PageResult<T> of(IPage<T> p) {
        return new PageResult<>(p.getRecords(), p.getTotal(), p.getCurrent(), p.getSize());
    }

    public static <T, R> PageResult<R> of(IPage<T> p, java.util.function.Function<T, R> mapper) {
        return new PageResult<>(p.getRecords().stream().map(mapper).toList(), p.getTotal(), p.getCurrent(), p.getSize());
    }
}
