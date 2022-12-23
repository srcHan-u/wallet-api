import { Router } from 'express';
import controller from './docController';


const router = Router();

// one
router.route('/doc/:id')
  .get(controller.getOne)
  .put(controller.updateOne)
  .delete(controller.deleteOne);

router.route('/doc')
  .post(controller.createOne);

// many
router.route('/docs')
  .get(controller.getMany);


export default router;
