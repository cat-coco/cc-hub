package com.claudecode.hub.content.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.claudecode.hub.content.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {

    @Update("UPDATE article SET view_count = view_count + 1 WHERE id = #{id}")
    int incrView(@Param("id") long id);

    @Update("UPDATE article SET like_count = like_count + #{delta} WHERE id = #{id}")
    int addLike(@Param("id") long id, @Param("delta") int delta);

    @Update("UPDATE article SET collect_count = collect_count + #{delta} WHERE id = #{id}")
    int addCollect(@Param("id") long id, @Param("delta") int delta);

    @Update("UPDATE article SET comment_count = comment_count + #{delta} WHERE id = #{id}")
    int addComment(@Param("id") long id, @Param("delta") int delta);
}
