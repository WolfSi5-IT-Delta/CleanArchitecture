<?php

namespace App\Packages\OrgBoard\Infrastructure\Repositories;

use App\Packages\Common\Infrastructure\Repositories\AbstractRepository;
use App\Packages\OrgBoard\Entities\Post;

class PostRepository extends AbstractRepository
{
    function model()
    {
        return 'App\Models\Post';
    }

    function mapProps($model)
    {
        return new Post($model->toArray());
    }

}
